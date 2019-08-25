const userProperties = `
  id
  email
  name
  surname
  contact
  address
  city
  state
  zip
  role
`;

const vehicleProperties = `
  id
  group
  size
  name
  model
  make
  year
  imageURI
  status
`;

const bookingProperties = `
  id
  pickupDate
  returnDate
  status
`;

export const userFragment: any = `{
  ${userProperties}
  bookings {
    ${bookingProperties}
    vehicle {
      ${vehicleProperties}
    }
    user {
      ${userProperties}
    }
  }
}`;

export const bookingFragment: any = `{
  ${bookingProperties}
  vehicle {
    ${vehicleProperties}
  }
  user {
    ${userProperties}
  }
}`;
