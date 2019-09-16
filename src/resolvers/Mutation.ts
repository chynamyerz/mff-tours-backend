// tslint:disable-next-line:no-var-requires
require("now-env");
import bcrypt from "bcrypt";
import moment from "moment";
import {
  Prisma,
  UserCreateInput,
  UserUpdateInput,
  VehicleCreateInput,
  VehicleUpdateInput
} from "../generated/prisma-client";
import {
  searchedVehiclesResults,
  transporter,
  validateEmail,
  validPassword
} from "../util";
import { bookingFragment } from "../util/adminProperties";

interface IContext {
  prisma: Prisma;
  user: { id: string };
}

// Defining user update interface
interface IUserUpdate extends UserUpdateInput {
  newPassword?: string;
}

// Defining vehicle update interface
interface IVehicleUpdate extends VehicleUpdateInput {
  vehicleId: string;
  password: string;
}

/**
 * The main Mutation object
 */
const Mutation = {
  /**
   * Register a new user
   *
   * @param root root
   * @param args arguments
   * @param ctx context
   *
   * Return the success message
   */
  async signup(root: any, args: UserCreateInput, ctx: IContext) {
    try {
      // Transform email address to lowercase.
      args.email = args.email.trim().toLowerCase();

      // Validate the submitted email address
      if (!validateEmail(args.email)) {
        throw Error("The email address is invalid");
      }

      // Check if the submitted email for registering already exists.
      if (await ctx.prisma.user({ email: args.email })) {
        throw Error("Email address already exists.");
      }

      // Check if the submitted password is valid
      if (!validPassword(args.password)) {
        throw Error("Password must be at least 5 characters long.");
      }

      // Hash password before stored in the database.
      const password = await bcrypt.hash(args.password, 10);

      await ctx.prisma.createUser({
        address: args.address,
        city: args.city,
        contact: args.contact,
        email: args.email,
        name: args.name,
        password,
        state: args.state,
        surname: args.surname,
        zip: args.zip
      });

      return { message: "Registered successfully" };
    } catch (e) {
      throw Error(e.message);
    }
  },

  /**
   * Updates the user information
   *
   * @param root parent
   * @param args arguments
   * @param ctx context
   *
   * Return the success message
   */
  async updateUser(root: any, args: IUserUpdate, ctx: any) {
    // Check if the user is logged in
    if (!ctx.user) {
      throw new Error("You must be logged in.");
    }

    try {
      // Logged in user information
      const user = await ctx.prisma.user({ id: ctx.user.id });

      // Check if the user password is correct
      if (user && !(await bcrypt.compare(args.password, user.password))) {
        throw new Error("Please provide a correct user password");
      }

      // An object holding arguments to update
      const userToUpdate: IUserUpdate = {};

      // If user name is to change
      if (args.name) {
        userToUpdate.name = args.name;
      }

      // If user surname is to change
      if (args.surname) {
        userToUpdate.surname = args.surname;
      }

      // If user contact is to change
      if (args.contact) {
        userToUpdate.contact = args.contact;
      }

      // If user address is to change
      if (args.address) {
        userToUpdate.address = args.address;
      }

      // If user city is to change
      if (args.city) {
        userToUpdate.city = args.city;
      }

      // If user state is to change
      if (args.state) {
        userToUpdate.state = args.state;
      }

      // If user zip is to change
      if (args.zip) {
        userToUpdate.zip = args.zip;
      }

      // If user email is to change
      if (user && args.email && args.email !== user.email) {
        // Transform email address to lowercase.
        args.email = args.email.trim().toLowerCase();

        // Check if the submitted email for registering already exists.
        if (await ctx.prisma.user({ email: args.email })) {
          throw new Error("Email address already exists.");
        }

        userToUpdate.email = args.email;
      }

      // If user password is to change
      if (args.newPassword) {
        // Hash password before stored in the database.
        const password = await bcrypt.hash(args.newPassword, 10);

        userToUpdate.password = password;
      }

      await ctx.prisma.updateUser({
        data: userToUpdate,
        where: {
          id: ctx.user.id
        }
      });

      return { message: "Updated successfully" };
    } catch (e) {
      throw Error(e.message);
    }
  },

  /**
   * Make a booking for a specific slot
   *
   * @param root parent
   * @param args arguments
   * @param ctx context
   *
   * Return a success message
   */
  async bookVehicle(root: any, args: any, ctx: IContext) {
    try {
      // currently logged in user
      const user = ctx.user
        ? await ctx.prisma.user({
            id: ctx.user.id
          })
        : await ctx.prisma.user({
            email: args.email
          });

      if (!user) {
        throw Error(`We couldn't retrieve user information.
        Please make sure user information has been provided prior to booking.`);
      }

      let userToBookFor = null;

      // Booking on behalf of the client
      if (user && user.role === "ADMIN") {
        // client
        userToBookFor = await ctx.prisma.user({
          email: args.email
        });

        if (!userToBookFor) {
          throw Error(`We couldn't retrieve the information of the user you are trying to book for. 
          Either the user is not added to the database or something went wrong.
          If the latter, please try again later, else make sure you add the user first`);
        }

        // Check if the vehicle is available
        const vehicle: any = await ctx.prisma.vehicle({
          id: args.vehicleId
        });

        if (!vehicle) {
          throw Error(
            "The vehicle you are trying to book is currently not available."
          );
        }

        // Update the vehicle count
        await ctx.prisma.updateVehicle({
          data: {
            count: vehicle.count - 1
          },
          where: {
            id: vehicle.id
          }
        });

        await ctx.prisma.createBooking({
          bookingPrice: args.beyondKZN ? "2000.00" : vehicle.price,
          pickupDate: args.pickupDate.toString(),
          returnDate: args.returnDate.toString(),
          status: "BOOKED",
          user: {
            connect: {
              id: userToBookFor.id
            }
          },
          vehicle: {
            connect: {
              id: vehicle.id
            }
          }
        });

        const userContentEmail = `
          Dear ${user.name} <br /><br />
          You recently booked for a vehicle rental with MFF Car Rentals.<br />
          This email serves to confirm that your booking was successful and the MFF Car Rentals is aware of it.<br /><br />
          Booking information can be viewed on the website under Bookings. <strong>(You must be logged in to view them)</strong><br />
          In the future, follow this link for terms and conditions:<a href="${process.env.REACT_APP_MMF_BACKEND_URL}/termsandconditions">
          MFF Car Rentals Terms and Conditions</a><br /><br />
          Thank you<br /><br />
          MFF Car Rentals`;

        const adminContentEmail = `
          Dear MFF Car Rentals <br /><br />
          This email servers as an alert concerning a recent booking that has just been made by ${user.name}<br /><br />
          Please navigate to the Bookings screen in the web to see the details.
        `;

        const userEmail = {
          from: "mffcars@gmail.com",
          html: userContentEmail,
          subject: "MFF Car Rentals vehicle booking confirmation.",
          to: user.email
        };

        await transporter.sendMail(userEmail);

        const admintEmail = {
          from: "mffcars@gmail.com",
          html: adminContentEmail,
          subject: "MFF Car Rentals vehicle booking confirmation.",
          to: "mffcars@gmail.com"
        };

        await transporter.sendMail(admintEmail);

        return { message: "Booked successfully" };
      } else {
        // Check if the vehicle is available
        const vehicle: any = await ctx.prisma.vehicle({
          id: args.vehicleId
        });

        if (!vehicle) {
          throw Error(
            "The vehicle you are trying to book is currently not available."
          );
        }

        // Update the vehicle count
        await ctx.prisma.updateVehicle({
          data: {
            count: vehicle.count - 1
          },
          where: {
            id: vehicle.id
          }
        });

        await ctx.prisma.createBooking({
          bookingPrice: args.beyondKZN ? "2000.00" : vehicle.price,
          pickupDate: moment(args.pickupDate).format(),
          returnDate: moment(args.returnDate).format(),
          status: "BOOKED",
          user: {
            connect: {
              id: user.id
            }
          },
          vehicle: {
            connect: {
              id: vehicle.id
            }
          }
        });

        const userContentEmail = `
          Dear ${user.name} <br /><br />
          You recently booked for a vehicle rental with MFF Car Rentals.<br />
          This email serves to confirm that your booking was successful and the MFF Car Rentals is aware of it.<br /><br />
          Booking information can be viewed on the website under Bookings. <strong>(You must be logged in to view them)</strong><br />
          In the future, follow this link for terms and conditions:<a href="${process.env.REACT_APP_MMF_BACKEND_URL}/termsandconditions">
          MFF Car Rentals Terms and Conditions</a><br /><br />
          Thank you<br /><br />
          MFF Car Rentals
        `;

        const adminContentEmail = `
          Dear MFF Car Rentals <br /><br />
          This email servers as an alert concerning a recent booking that has just been made by ${user.name}<br /><br />
          Please navigate to the Bookings screen in the web to see the details.
        `;

        const userEmail = {
          from: "mffcars@gmail.com",
          html: userContentEmail,
          subject: "MFF Car Rentals vehicle booking confirmation.",
          to: user.email
        };

        await transporter.sendMail(userEmail);

        const admintEmail = {
          from: "mffcars@gmail.com",
          html: adminContentEmail,
          subject: "MFF Car Rentals vehicle booking confirmation.",
          to: "mffcars@gmail.com"
        };

        await transporter.sendMail(admintEmail);

        return { message: "Booked successfully" };
      }
    } catch (e) {
      throw Error(e.message);
    }
  },

  /**
   * Cancel the specific booking
   *
   * @param root parent
   * @param args arguments
   * @param ctx context
   *
   * Return the success message
   */
  async cancelBooking(root: any, args: any, ctx: IContext) {
    // Check if the user is logged in
    if (!ctx.user) {
      throw new Error("You must be logged in.");
    }

    try {
      // currently logged in user
      const user = await ctx.prisma.user({
        id: ctx.user.id
      });

      if (!user) {
        throw Error(`We couldn't retrieve your information. 
        Either you are not registered or something went wrong.
        If the latter, please try again later, else make sure you are rigistered`);
      }

      // Check if the booking exist
      const booking: any = await ctx.prisma
        .booking({
          id: args.bookingId
        })
        .$fragment(bookingFragment);

      if (
        !booking ||
        booking.status === "CANCELLED" ||
        booking.status === "RETURNED"
      ) {
        throw Error("The booking you are trying to cancel does not exist.");
      }

      const vehicleId = (booking as any).vehicle.id;

      // Check if the booking was linked to a vehicle
      const vehicle = await ctx.prisma.vehicle({
        id: vehicleId
      });

      if (!vehicle) {
        throw Error(
          "This booking vehicle no longer exists. Please contact the MFF Tours about this issue."
        );
      }

      // Update the status of the booking to cancel
      await ctx.prisma.updateBooking({
        data: {
          status: "CANCELLED"
        },
        where: {
          id: args.bookingId
        }
      });

      // Update the vehicle count
      await ctx.prisma.updateVehicle({
        data: {
          count: vehicle.count + 1
        },
        where: {
          id: vehicleId
        }
      });

      return { message: "Cancelled booking successfully" };
    } catch (e) {
      throw Error(e.message);
    }
  },

  /**
   * The search vehicles mutation
   *
   * @param root parent
   * @param args arguments
   * @param ctx context
   *
   * Returns the list of vehicles information
   */
  async searchVehicles(root: any, args: any, ctx: IContext) {
    try {
      const bookedVehicles: any = await ctx.prisma
        .bookings({
          where: {
            AND: {
              AND: [
                {
                  pickupDate_lte: moment(args.pickupDate).format()
                },
                {
                  returnDate_gte: moment(args.pickupDate).format()
                },
                {
                  pickupDate_lte: moment(args.returnDate).format()
                },
                {
                  returnDate_gte: moment(args.returnDate).format()
                }
              ]
            }
          }
        })
        .$fragment(bookingFragment);

      if (args.location === "EMPANGENI" || args.location === "RICHARDS_BAY") {
        const searchedVehicles = await ctx.prisma.vehicles({
          where: {
            count_gte: 1,
            location_in: [args.location]
          }
        });

        return bookedVehicles.length
          ? searchedVehiclesResults(bookedVehicles, searchedVehicles)
          : searchedVehicles;
      } else {
        const searchedVehicles = await ctx.prisma.vehicles({
          where: {
            count_gte: 1
          }
        });

        return bookedVehicles.length
          ? searchedVehiclesResults(bookedVehicles, searchedVehicles)
          : searchedVehicles;
      }
    } catch (e) {
      throw Error(e.message);
    }
  },

  /**
   * Add a new vehicle
   *
   * @param root root
   * @param args arguments
   * @param ctx context
   *
   * Return the success message
   */
  async addVehicle(root: any, args: VehicleCreateInput, ctx: IContext) {
    // Check if the user is logged in
    if (!ctx.user) {
      throw new Error("You must be logged in.");
    }

    try {
      // currently logged in user
      const user = await ctx.prisma.user({
        id: ctx.user.id
      });

      if (!user) {
        throw Error(`We couldn't retrieve your information. 
        Either you are not registered or something went wrong.
        If the latter, please try again later, else make sure you are rigistered`);
      }

      // You must be an admin
      if (!(user.role === "ADMIN")) {
        throw Error(`Only admin are allowed to add vehicle`);
      }

      // Add vehicle
      await ctx.prisma.createVehicle({
        airType: args.airType,
        bags: args.bags,
        count: args.count,
        doors: args.doors,
        fuelType: args.fuelType,
        group: args.group,
        imageURI: args.imageURI,
        location: args.location,
        make: args.make,
        model: args.model,
        name: args.name,
        price: args.price,
        seaters: args.seaters,
        size: args.size,
        status: args.status,
        transmissionType: args.transmissionType,
        year: args.year
      });

      return { message: "Vehicle added succefully." };
    } catch (e) {
      throw Error(e.message);
    }
  },

  /**
   * Update a vehicle
   *
   * @param root root
   * @param args arguments
   * @param ctx context
   *
   * Return the success message
   */
  async updateVehicle(root: any, args: IVehicleUpdate, ctx: IContext) {
    // Check if the user is logged in
    if (!ctx.user) {
      throw new Error("You must be logged in.");
    }

    try {
      const user = await ctx.prisma.user({ id: ctx.user.id });

      if (!user) {
        throw Error(`We couldn't retrieve your information. 
        Either you are not registered or something went wrong.
        If the latter, please try again later, else make sure you are rigistered`);
      }

      // Check if the user password is correct
      if (user && !(await bcrypt.compare(args.password, user.password))) {
        throw new Error("Please provide a correct user password");
      }

      // You must be an admin
      if (!(user.role === "ADMIN")) {
        throw Error(`Only admin are allowed to add vehicle`);
      }

      const vehicle: any = await ctx.prisma.vehicle({
        id: args.vehicleId
      });

      if (!vehicle) {
        throw Error(`We couldn't retrieve vehicle information. 
        Either it does not exist or something went wrong.
        If the latter, please try again later, else make sure vehicle exist by adding it first`);
      }

      // An object holding arguments to update
      const vehicleToUpdate: VehicleUpdateInput = {};

      // If vehicle count is to change
      if (args.count) {
        vehicleToUpdate.count = args.count;
      }

      // If vehicle group is to change
      if (args.group) {
        vehicleToUpdate.group = args.group;
      }

      // If vehicle imageURI is to change
      if (args.imageURI) {
        vehicleToUpdate.imageURI = args.imageURI;
      }

      // If vehicle make is to change
      if (args.make) {
        vehicleToUpdate.make = args.make;
      }

      // If vehicle model is to change
      if (args.model) {
        vehicleToUpdate.model = args.model;
      }

      // If vehicle model is to change
      if (args.model) {
        vehicleToUpdate.model = args.model;
      }

      // If vehicle name is to change
      if (args.name) {
        vehicleToUpdate.name = args.name;
      }

      // If vehicle size is to change
      if (args.size) {
        vehicleToUpdate.size = args.size;
      }

      // If vehicle status is to change
      if (args.status) {
        vehicleToUpdate.status = args.status;
      }

      // If vehicle year is to change
      if (args.year) {
        vehicleToUpdate.year = args.year;
      }

      // If vehicle location is to change
      if (args.location) {
        vehicleToUpdate.location = args.location;
      }

      // If vehicle doors is to change
      if (args.doors) {
        vehicleToUpdate.doors = args.doors;
      }

      // If vehicle seaters is to change
      if (args.seaters) {
        vehicleToUpdate.seaters = args.seaters;
      }

      // If vehicle fuelType is to change
      if (args.fuelType) {
        vehicleToUpdate.fuelType = args.fuelType;
      }

      // If vehicle transmissionType is to change
      if (args.transmissionType) {
        vehicleToUpdate.transmissionType = args.transmissionType;
      }

      // If vehicle airType is to change
      if (args.airType) {
        vehicleToUpdate.airType = args.airType;
      }

      // If vehicle bags is to change
      if (args.bags) {
        vehicleToUpdate.bags = args.bags;
      }

      // If vehicle price is to change
      if (args.price) {
        vehicleToUpdate.price = args.price;
      }

      // Add vehicle
      await ctx.prisma.updateVehicle({
        data: vehicleToUpdate,
        where: {
          id: vehicle.id
        }
      });

      return { message: "Vehicle added succefully." };
    } catch (e) {
      throw Error(e.message);
    }
  },

  /**
   * Update a vehicle
   *
   * @param root root
   * @param args arguments
   * @param ctx context
   *
   * Return the success message
   */
  async deleteVehicle(root: any, args: IVehicleUpdate, ctx: IContext) {
    // Check if the user is logged in
    if (!ctx.user) {
      throw new Error("You must be logged in.");
    }

    try {
      const user = await ctx.prisma.user({ id: ctx.user.id });

      if (!user) {
        throw Error(`We couldn't retrieve your information. 
        Either you are not registered or something went wrong.
        If the latter, please try again later, else make sure you are rigistered`);
      }

      // Check if the user password is correct
      if (user && !(await bcrypt.compare(args.password, user.password))) {
        throw new Error("Please provide a correct user password");
      }

      // You must be an admin
      if (!(user.role === "ADMIN")) {
        throw Error(`Only admin are allowed to add vehicle`);
      }

      const vehicle: any = await ctx.prisma.vehicle({
        id: args.vehicleId
      });

      if (!vehicle) {
        throw Error(`We couldn't retrieve vehicle information. 
        Either it does not exist or something went wrong.
        If the latter, please try again later, else make sure vehicle exist by adding it first`);
      }

      // For now, a veh
      await ctx.prisma.updateVehicle({
        data: {
          status: "DELETED"
        },
        where: {
          id: vehicle.id
        }
      });

      return { message: "Vehicle deleted succefully." };
    } catch (e) {
      throw Error(e.message);
    }
  },

  /**
   * Request to reset the password
   *
   * @param root parent
   * @param args arguments
   * @param ctx context
   *
   * Return the success message
   */
  async requestReset(root: any, args: any, ctx: IContext) {
    // Transform email address to lowercase.
    args.email = args.email.trim().toLowerCase();

    try {
      // Check if this is a real user
      const user = await ctx.prisma.user({ email: args.email });

      if (!user) {
        throw new Error(`No such user found for email ${args.email}`);
      }

      // Set a reset one time pin and expiry on that user
      const oneTimePin = (Math.random() * 10000).toFixed();
      const resetTokenExpiry = moment(Date.now())
        .add(1, "hours")
        .toDate();

      await ctx.prisma.updateUser({
        data: { oneTimePin, resetTokenExpiry },
        where: { email: args.email }
      });

      const html = `
        Dear ${user.name} ${user.surname},<br /><br />
        Someone (probably you) has requested to reset your password for MFF Tours.<br /><br />
        Please use the OTP below to change the password:<br /><br />
        OTP: ${oneTimePin}<br>
        Link: <a href="${process.env.MMF_FRONTEND_HOST}/reset-password">
        ${process.env.MMF_FRONTEND_HOST}/reset-password
        </a><br /><br />
        If you have not requested to reset your password there is no need for any action from your side.<br /><br />
        Kind Regards,<br /><br />
        MFF Tours Team
      `;

      const email = {
        from: "mffcars@gmail.com",
        html,
        subject: "Reset your password for the MFF Tours",
        to: user.email
      };

      await transporter.sendMail(email);

      return { message: "Requested password change successfully" };
    } catch (e) {
      throw Error(e.message);
    }
  },

  /**
   * Reset the password
   *
   * @param root parent
   * @param args arguments
   * @param ctx context
   *
   * Returns the success message
   */
  async resetPassword(root: any, args: any, ctx: IContext) {
    try {
      // Check if its a legit one time pin
      // And check if the one time pin is not expired
      const [user] = await ctx.prisma.users({
        where: {
          oneTimePin: args.oneTimePin,
          resetTokenExpiry_gte: moment(Date.now()).toDate()
        }
      });

      if (!user) {
        throw new Error(
          "This one time pin is either invalid or expired. \nPlease re-request another one"
        );
      }

      // Hash the new password
      const password = await bcrypt.hash(args.password, 10);

      // Save the new password to the user and remove old one time pin fields
      await ctx.prisma.updateUser({
        data: {
          oneTimePin: "",
          password,
          resetTokenExpiry: moment(Date.now()).toDate()
        },
        where: {
          email: user.email
        }
      });
      return { message: "Password changed successfully" };
    } catch (e) {
      throw Error(e.message);
    }
  }
};

export { Mutation };
