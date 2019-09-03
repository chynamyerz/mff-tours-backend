// Code generated by Prisma (prisma@1.34.6). DO NOT EDIT.
  // Please don't change this file manually but run `prisma generate` to update it.
  // For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

export const typeDefs = /* GraphQL */ `type AggregateBooking {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type AggregateVehicle {
  count: Int!
}

type BatchPayload {
  count: Long!
}

type Booking {
  id: ID!
  vehicle: Vehicle!
  user: User!
  pickupDate: DateTime!
  returnDate: DateTime!
  status: BookingStatus!
}

type BookingConnection {
  pageInfo: PageInfo!
  edges: [BookingEdge]!
  aggregate: AggregateBooking!
}

input BookingCreateInput {
  id: ID
  vehicle: VehicleCreateOneInput!
  user: UserCreateOneWithoutBookingsInput!
  pickupDate: DateTime!
  returnDate: DateTime!
  status: BookingStatus!
}

input BookingCreateManyWithoutUserInput {
  create: [BookingCreateWithoutUserInput!]
  connect: [BookingWhereUniqueInput!]
}

input BookingCreateWithoutUserInput {
  id: ID
  vehicle: VehicleCreateOneInput!
  pickupDate: DateTime!
  returnDate: DateTime!
  status: BookingStatus!
}

type BookingEdge {
  node: Booking!
  cursor: String!
}

enum BookingOrderByInput {
  id_ASC
  id_DESC
  pickupDate_ASC
  pickupDate_DESC
  returnDate_ASC
  returnDate_DESC
  status_ASC
  status_DESC
}

type BookingPreviousValues {
  id: ID!
  pickupDate: DateTime!
  returnDate: DateTime!
  status: BookingStatus!
}

input BookingScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  pickupDate: DateTime
  pickupDate_not: DateTime
  pickupDate_in: [DateTime!]
  pickupDate_not_in: [DateTime!]
  pickupDate_lt: DateTime
  pickupDate_lte: DateTime
  pickupDate_gt: DateTime
  pickupDate_gte: DateTime
  returnDate: DateTime
  returnDate_not: DateTime
  returnDate_in: [DateTime!]
  returnDate_not_in: [DateTime!]
  returnDate_lt: DateTime
  returnDate_lte: DateTime
  returnDate_gt: DateTime
  returnDate_gte: DateTime
  status: BookingStatus
  status_not: BookingStatus
  status_in: [BookingStatus!]
  status_not_in: [BookingStatus!]
  AND: [BookingScalarWhereInput!]
  OR: [BookingScalarWhereInput!]
  NOT: [BookingScalarWhereInput!]
}

enum BookingStatus {
  BOOKED
  CANCELLED
  RETURNED
}

type BookingSubscriptionPayload {
  mutation: MutationType!
  node: Booking
  updatedFields: [String!]
  previousValues: BookingPreviousValues
}

input BookingSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: BookingWhereInput
  AND: [BookingSubscriptionWhereInput!]
  OR: [BookingSubscriptionWhereInput!]
  NOT: [BookingSubscriptionWhereInput!]
}

input BookingUpdateInput {
  vehicle: VehicleUpdateOneRequiredInput
  user: UserUpdateOneRequiredWithoutBookingsInput
  pickupDate: DateTime
  returnDate: DateTime
  status: BookingStatus
}

input BookingUpdateManyDataInput {
  pickupDate: DateTime
  returnDate: DateTime
  status: BookingStatus
}

input BookingUpdateManyMutationInput {
  pickupDate: DateTime
  returnDate: DateTime
  status: BookingStatus
}

input BookingUpdateManyWithoutUserInput {
  create: [BookingCreateWithoutUserInput!]
  delete: [BookingWhereUniqueInput!]
  connect: [BookingWhereUniqueInput!]
  set: [BookingWhereUniqueInput!]
  disconnect: [BookingWhereUniqueInput!]
  update: [BookingUpdateWithWhereUniqueWithoutUserInput!]
  upsert: [BookingUpsertWithWhereUniqueWithoutUserInput!]
  deleteMany: [BookingScalarWhereInput!]
  updateMany: [BookingUpdateManyWithWhereNestedInput!]
}

input BookingUpdateManyWithWhereNestedInput {
  where: BookingScalarWhereInput!
  data: BookingUpdateManyDataInput!
}

input BookingUpdateWithoutUserDataInput {
  vehicle: VehicleUpdateOneRequiredInput
  pickupDate: DateTime
  returnDate: DateTime
  status: BookingStatus
}

input BookingUpdateWithWhereUniqueWithoutUserInput {
  where: BookingWhereUniqueInput!
  data: BookingUpdateWithoutUserDataInput!
}

input BookingUpsertWithWhereUniqueWithoutUserInput {
  where: BookingWhereUniqueInput!
  update: BookingUpdateWithoutUserDataInput!
  create: BookingCreateWithoutUserInput!
}

input BookingWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  vehicle: VehicleWhereInput
  user: UserWhereInput
  pickupDate: DateTime
  pickupDate_not: DateTime
  pickupDate_in: [DateTime!]
  pickupDate_not_in: [DateTime!]
  pickupDate_lt: DateTime
  pickupDate_lte: DateTime
  pickupDate_gt: DateTime
  pickupDate_gte: DateTime
  returnDate: DateTime
  returnDate_not: DateTime
  returnDate_in: [DateTime!]
  returnDate_not_in: [DateTime!]
  returnDate_lt: DateTime
  returnDate_lte: DateTime
  returnDate_gt: DateTime
  returnDate_gte: DateTime
  status: BookingStatus
  status_not: BookingStatus
  status_in: [BookingStatus!]
  status_not_in: [BookingStatus!]
  AND: [BookingWhereInput!]
  OR: [BookingWhereInput!]
  NOT: [BookingWhereInput!]
}

input BookingWhereUniqueInput {
  id: ID
}

scalar DateTime

enum Location {
  RICHARDS_BAY
  EMPANGENI
}

scalar Long

type Mutation {
  createBooking(data: BookingCreateInput!): Booking!
  updateBooking(data: BookingUpdateInput!, where: BookingWhereUniqueInput!): Booking
  updateManyBookings(data: BookingUpdateManyMutationInput!, where: BookingWhereInput): BatchPayload!
  upsertBooking(where: BookingWhereUniqueInput!, create: BookingCreateInput!, update: BookingUpdateInput!): Booking!
  deleteBooking(where: BookingWhereUniqueInput!): Booking
  deleteManyBookings(where: BookingWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
  createVehicle(data: VehicleCreateInput!): Vehicle!
  updateVehicle(data: VehicleUpdateInput!, where: VehicleWhereUniqueInput!): Vehicle
  updateManyVehicles(data: VehicleUpdateManyMutationInput!, where: VehicleWhereInput): BatchPayload!
  upsertVehicle(where: VehicleWhereUniqueInput!, create: VehicleCreateInput!, update: VehicleUpdateInput!): Vehicle!
  deleteVehicle(where: VehicleWhereUniqueInput!): Vehicle
  deleteManyVehicles(where: VehicleWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  booking(where: BookingWhereUniqueInput!): Booking
  bookings(where: BookingWhereInput, orderBy: BookingOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Booking]!
  bookingsConnection(where: BookingWhereInput, orderBy: BookingOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): BookingConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  vehicle(where: VehicleWhereUniqueInput!): Vehicle
  vehicles(where: VehicleWhereInput, orderBy: VehicleOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Vehicle]!
  vehiclesConnection(where: VehicleWhereInput, orderBy: VehicleOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): VehicleConnection!
  node(id: ID!): Node
}

enum Role {
  ADMIN
}

type Subscription {
  booking(where: BookingSubscriptionWhereInput): BookingSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
  vehicle(where: VehicleSubscriptionWhereInput): VehicleSubscriptionPayload
}

type User {
  id: ID!
  email: String!
  name: String!
  surname: String!
  contact: String!
  address: String
  city: String!
  state: String!
  zip: String!
  password: String!
  oneTimePin: String
  resetTokenExpiry: DateTime
  role: Role
  bookings(where: BookingWhereInput, orderBy: BookingOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Booking!]
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  id: ID
  email: String!
  name: String!
  surname: String!
  contact: String!
  address: String
  city: String!
  state: String!
  zip: String!
  password: String!
  oneTimePin: String
  resetTokenExpiry: DateTime
  role: Role
  bookings: BookingCreateManyWithoutUserInput
}

input UserCreateOneWithoutBookingsInput {
  create: UserCreateWithoutBookingsInput
  connect: UserWhereUniqueInput
}

input UserCreateWithoutBookingsInput {
  id: ID
  email: String!
  name: String!
  surname: String!
  contact: String!
  address: String
  city: String!
  state: String!
  zip: String!
  password: String!
  oneTimePin: String
  resetTokenExpiry: DateTime
  role: Role
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  email_ASC
  email_DESC
  name_ASC
  name_DESC
  surname_ASC
  surname_DESC
  contact_ASC
  contact_DESC
  address_ASC
  address_DESC
  city_ASC
  city_DESC
  state_ASC
  state_DESC
  zip_ASC
  zip_DESC
  password_ASC
  password_DESC
  oneTimePin_ASC
  oneTimePin_DESC
  resetTokenExpiry_ASC
  resetTokenExpiry_DESC
  role_ASC
  role_DESC
}

type UserPreviousValues {
  id: ID!
  email: String!
  name: String!
  surname: String!
  contact: String!
  address: String
  city: String!
  state: String!
  zip: String!
  password: String!
  oneTimePin: String
  resetTokenExpiry: DateTime
  role: Role
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateInput {
  email: String
  name: String
  surname: String
  contact: String
  address: String
  city: String
  state: String
  zip: String
  password: String
  oneTimePin: String
  resetTokenExpiry: DateTime
  role: Role
  bookings: BookingUpdateManyWithoutUserInput
}

input UserUpdateManyMutationInput {
  email: String
  name: String
  surname: String
  contact: String
  address: String
  city: String
  state: String
  zip: String
  password: String
  oneTimePin: String
  resetTokenExpiry: DateTime
  role: Role
}

input UserUpdateOneRequiredWithoutBookingsInput {
  create: UserCreateWithoutBookingsInput
  update: UserUpdateWithoutBookingsDataInput
  upsert: UserUpsertWithoutBookingsInput
  connect: UserWhereUniqueInput
}

input UserUpdateWithoutBookingsDataInput {
  email: String
  name: String
  surname: String
  contact: String
  address: String
  city: String
  state: String
  zip: String
  password: String
  oneTimePin: String
  resetTokenExpiry: DateTime
  role: Role
}

input UserUpsertWithoutBookingsInput {
  update: UserUpdateWithoutBookingsDataInput!
  create: UserCreateWithoutBookingsInput!
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  surname: String
  surname_not: String
  surname_in: [String!]
  surname_not_in: [String!]
  surname_lt: String
  surname_lte: String
  surname_gt: String
  surname_gte: String
  surname_contains: String
  surname_not_contains: String
  surname_starts_with: String
  surname_not_starts_with: String
  surname_ends_with: String
  surname_not_ends_with: String
  contact: String
  contact_not: String
  contact_in: [String!]
  contact_not_in: [String!]
  contact_lt: String
  contact_lte: String
  contact_gt: String
  contact_gte: String
  contact_contains: String
  contact_not_contains: String
  contact_starts_with: String
  contact_not_starts_with: String
  contact_ends_with: String
  contact_not_ends_with: String
  address: String
  address_not: String
  address_in: [String!]
  address_not_in: [String!]
  address_lt: String
  address_lte: String
  address_gt: String
  address_gte: String
  address_contains: String
  address_not_contains: String
  address_starts_with: String
  address_not_starts_with: String
  address_ends_with: String
  address_not_ends_with: String
  city: String
  city_not: String
  city_in: [String!]
  city_not_in: [String!]
  city_lt: String
  city_lte: String
  city_gt: String
  city_gte: String
  city_contains: String
  city_not_contains: String
  city_starts_with: String
  city_not_starts_with: String
  city_ends_with: String
  city_not_ends_with: String
  state: String
  state_not: String
  state_in: [String!]
  state_not_in: [String!]
  state_lt: String
  state_lte: String
  state_gt: String
  state_gte: String
  state_contains: String
  state_not_contains: String
  state_starts_with: String
  state_not_starts_with: String
  state_ends_with: String
  state_not_ends_with: String
  zip: String
  zip_not: String
  zip_in: [String!]
  zip_not_in: [String!]
  zip_lt: String
  zip_lte: String
  zip_gt: String
  zip_gte: String
  zip_contains: String
  zip_not_contains: String
  zip_starts_with: String
  zip_not_starts_with: String
  zip_ends_with: String
  zip_not_ends_with: String
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  oneTimePin: String
  oneTimePin_not: String
  oneTimePin_in: [String!]
  oneTimePin_not_in: [String!]
  oneTimePin_lt: String
  oneTimePin_lte: String
  oneTimePin_gt: String
  oneTimePin_gte: String
  oneTimePin_contains: String
  oneTimePin_not_contains: String
  oneTimePin_starts_with: String
  oneTimePin_not_starts_with: String
  oneTimePin_ends_with: String
  oneTimePin_not_ends_with: String
  resetTokenExpiry: DateTime
  resetTokenExpiry_not: DateTime
  resetTokenExpiry_in: [DateTime!]
  resetTokenExpiry_not_in: [DateTime!]
  resetTokenExpiry_lt: DateTime
  resetTokenExpiry_lte: DateTime
  resetTokenExpiry_gt: DateTime
  resetTokenExpiry_gte: DateTime
  role: Role
  role_not: Role
  role_in: [Role!]
  role_not_in: [Role!]
  bookings_every: BookingWhereInput
  bookings_some: BookingWhereInput
  bookings_none: BookingWhereInput
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
}

type Vehicle {
  id: ID!
  group: VehicleGroup!
  size: VehicleSize!
  name: String!
  model: String!
  make: String!
  year: DateTime!
  imageURI: String!
  status: VehicleStatus!
  location: Location!
}

type VehicleConnection {
  pageInfo: PageInfo!
  edges: [VehicleEdge]!
  aggregate: AggregateVehicle!
}

input VehicleCreateInput {
  id: ID
  group: VehicleGroup!
  size: VehicleSize!
  name: String!
  model: String!
  make: String!
  year: DateTime!
  imageURI: String!
  status: VehicleStatus!
  location: Location!
}

input VehicleCreateOneInput {
  create: VehicleCreateInput
  connect: VehicleWhereUniqueInput
}

type VehicleEdge {
  node: Vehicle!
  cursor: String!
}

enum VehicleGroup {
  A
  B
  C
  D
  E
}

enum VehicleOrderByInput {
  id_ASC
  id_DESC
  group_ASC
  group_DESC
  size_ASC
  size_DESC
  name_ASC
  name_DESC
  model_ASC
  model_DESC
  make_ASC
  make_DESC
  year_ASC
  year_DESC
  imageURI_ASC
  imageURI_DESC
  status_ASC
  status_DESC
  location_ASC
  location_DESC
}

type VehiclePreviousValues {
  id: ID!
  group: VehicleGroup!
  size: VehicleSize!
  name: String!
  model: String!
  make: String!
  year: DateTime!
  imageURI: String!
  status: VehicleStatus!
  location: Location!
}

enum VehicleSize {
  SMALL
  MEDIUM
  LARGE
}

enum VehicleStatus {
  AVAILABLE
  UNAVAILABLE
  DELETED
}

type VehicleSubscriptionPayload {
  mutation: MutationType!
  node: Vehicle
  updatedFields: [String!]
  previousValues: VehiclePreviousValues
}

input VehicleSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: VehicleWhereInput
  AND: [VehicleSubscriptionWhereInput!]
  OR: [VehicleSubscriptionWhereInput!]
  NOT: [VehicleSubscriptionWhereInput!]
}

input VehicleUpdateDataInput {
  group: VehicleGroup
  size: VehicleSize
  name: String
  model: String
  make: String
  year: DateTime
  imageURI: String
  status: VehicleStatus
  location: Location
}

input VehicleUpdateInput {
  group: VehicleGroup
  size: VehicleSize
  name: String
  model: String
  make: String
  year: DateTime
  imageURI: String
  status: VehicleStatus
  location: Location
}

input VehicleUpdateManyMutationInput {
  group: VehicleGroup
  size: VehicleSize
  name: String
  model: String
  make: String
  year: DateTime
  imageURI: String
  status: VehicleStatus
  location: Location
}

input VehicleUpdateOneRequiredInput {
  create: VehicleCreateInput
  update: VehicleUpdateDataInput
  upsert: VehicleUpsertNestedInput
  connect: VehicleWhereUniqueInput
}

input VehicleUpsertNestedInput {
  update: VehicleUpdateDataInput!
  create: VehicleCreateInput!
}

input VehicleWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  group: VehicleGroup
  group_not: VehicleGroup
  group_in: [VehicleGroup!]
  group_not_in: [VehicleGroup!]
  size: VehicleSize
  size_not: VehicleSize
  size_in: [VehicleSize!]
  size_not_in: [VehicleSize!]
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  model: String
  model_not: String
  model_in: [String!]
  model_not_in: [String!]
  model_lt: String
  model_lte: String
  model_gt: String
  model_gte: String
  model_contains: String
  model_not_contains: String
  model_starts_with: String
  model_not_starts_with: String
  model_ends_with: String
  model_not_ends_with: String
  make: String
  make_not: String
  make_in: [String!]
  make_not_in: [String!]
  make_lt: String
  make_lte: String
  make_gt: String
  make_gte: String
  make_contains: String
  make_not_contains: String
  make_starts_with: String
  make_not_starts_with: String
  make_ends_with: String
  make_not_ends_with: String
  year: DateTime
  year_not: DateTime
  year_in: [DateTime!]
  year_not_in: [DateTime!]
  year_lt: DateTime
  year_lte: DateTime
  year_gt: DateTime
  year_gte: DateTime
  imageURI: String
  imageURI_not: String
  imageURI_in: [String!]
  imageURI_not_in: [String!]
  imageURI_lt: String
  imageURI_lte: String
  imageURI_gt: String
  imageURI_gte: String
  imageURI_contains: String
  imageURI_not_contains: String
  imageURI_starts_with: String
  imageURI_not_starts_with: String
  imageURI_ends_with: String
  imageURI_not_ends_with: String
  status: VehicleStatus
  status_not: VehicleStatus
  status_in: [VehicleStatus!]
  status_not_in: [VehicleStatus!]
  location: Location
  location_not: Location
  location_in: [Location!]
  location_not_in: [Location!]
  AND: [VehicleWhereInput!]
  OR: [VehicleWhereInput!]
  NOT: [VehicleWhereInput!]
}

input VehicleWhereUniqueInput {
  id: ID
}
`