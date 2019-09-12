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
  count
  group
  size
  name
  model
  make
  year
  imageURI
  status
  location
  doors
  seaters
  fuelType
  transmissionType
  airType
  bags
  price
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
