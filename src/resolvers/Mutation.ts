import bcrypt from "bcrypt";
import moment from "moment";
import {
  Prisma,
  UserCreateInput,
  UserUpdateInput
} from "../generated/prisma-client";
import { transport, validateEmail, validPassword } from "../util";
import { bookingFragment } from "../util/adminProperties";

interface IContext {
  prisma: Prisma;
  user: { id: string };
}

// Defining user update interface
interface IUserUpdate extends UserUpdateInput {
  newPassword?: string;
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
      throw new Error("You must be logged in to update user information.");
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
    // Check if the user is logged in
    if (!ctx.user) {
      throw new Error("You must be logged in to make a booking.");
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

      let userToBookFor = null;

      // Booking on behalf of the client
      if (args.email && user.role === "ADMIN") {
        // currently logged in user
        userToBookFor = await ctx.prisma.user({
          email: args.email
        });

        if (!userToBookFor) {
          throw Error(`We couldn't retrieve the information of the user you are trying to book for. 
          Either the user is not added to the database or something went wrong.
          If the latter, please try again later, else make sure you add the user first`);
        }
      }

      // Check if the vehicle is available
      const vehicle: any = await ctx.prisma.vehicle({
        id: args.vehicleId
      });

      if (!vehicle || vehicle.status === "UNAVAILABLE") {
        throw Error(
          "The vehicle you are trying to book is currently not available."
        );
      }

      // Update the status of the vehicle to book
      await ctx.prisma.updateVehicle({
        data: {
          status: "UNAVAILABLE"
        },
        where: {
          id: vehicle.id
        }
      });

      await ctx.prisma.createBooking({
        pickupDate: args.pickupDate,
        returnDate: args.returnDate,
        status: "BOOKED",
        user: {
          connect: {
            id: userToBookFor ? userToBookFor.id : user.id
          }
        },
        vehicle: {
          connect: {
            id: vehicle.id
          }
        }
      });

      return { message: "Booked successfully" };
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
      throw new Error("You must be logged to cancel the booking");
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

      if (!vehicle || vehicle.status === "AVAILABLE") {
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

      // Update the slot to be avtive
      await ctx.prisma.updateVehicle({
        data: {
          status: "AVAILABLE"
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

      await transport.sendMail(email);

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
