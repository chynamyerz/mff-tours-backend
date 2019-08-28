import { Prisma } from "../generated/prisma-client";
import { bookingFragment, userFragment } from "../util/adminProperties";

interface IContext {
  prisma: Prisma;
  user: { id: string };
}

/**
 * The main Query object
 */
const Query = {
  /**
   * The user query
   *
   * @param root parent
   * @param args arguments
   * @param ctx context
   *
   * Returns the user information
   */
  async user(root: any, args: any, ctx: IContext) {
    // Check if user is looged in.
    if (!ctx.user) {
      return null;
    }
    try {
      return ctx.prisma.user({ id: ctx.user.id }).$fragment(userFragment);
    } catch (e) {
      throw Error(e.message);
    }
  },

  /**
   * The users query
   *
   * @param root parent
   * @param args arguments
   * @param ctx context
   *
   * Returns the list of users information
   */
  async users(root: any, args: any, ctx: IContext) {
    try {
      return ctx.prisma.users().$fragment(userFragment);
    } catch (e) {
      throw Error(e.message);
    }
  },

  /**
   * The cars query
   *
   * @param root parent
   * @param args arguments
   * @param ctx context
   *
   * Returns the list of vehicles information
   */
  async vehicles(root: any, args: any, ctx: IContext) {
    try {
      return ctx.prisma.vehicles();
    } catch (e) {
      throw Error(e.message);
    }
  },

  /**
   * The bookings query
   *
   * @param root parent
   * @param args arguments
   * @param ctx context
   *
   * Returns the list of bookings information
   */
  async bookings(root: any, args: any, ctx: IContext) {
    try {
      return ctx.prisma.bookings().$fragment(bookingFragment);
    } catch (e) {
      throw Error(e.message);
    }
  }
};

export { Query };
