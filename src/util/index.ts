// tslint:disable-next-line:no-var-requires
require("now-env");
import { validate } from "isemail";
import { createTransport } from "nodemailer";

// Transport for sending an email.
export const transporter = createTransport({
  auth: {
    pass: process.env.MMF_MAIL_PASSWORD,
    user: process.env.MMF_MAIL_USER
  },
  port: 465,
  service: process.env.MMF_MAIL_SERVICE
});

// const port: number = process.env.MAIL_PORT
//   ? Number(process.env.MAIL_PORT)
//   : 456;
// const secure: boolean = process.env.MAIL_SSL === "true" ? true : false;

// export const transport = createTransport({
//   auth: {
//     pass: process.env.MAIL_PASSWORD,
//     user: process.env.MAIL_USER
//   },
//   host: process.env.MAIL_HOST,
//   port,
//   secure
// });

// Check if the submitted email address is valid.
export const validateEmail = (email: string) =>
  validate(email, { minDomainAtoms: 2 });

// Check if the password length consist of at least 5 characters
export const validPassword = (password: string) => password.length >= 5;

// Check if the searched vehicle is not booked.
export const searchedVehiclesResults = (
  bookedVehicles: any,
  searchedVehicles: any
) =>
  searchedVehicles.filter((v: any) => {
    const vehicleIds = bookedVehicles.map((b: any) => {
      return b.vehicle.id;
    });

    return v.count >= 1 || !vehicleIds.includes(v.id);
  });
