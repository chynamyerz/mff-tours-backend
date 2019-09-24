// tslint:disable-next-line:no-var-requires
require("now-env");
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import session from "express-session";
import { GraphQLServer } from "graphql-yoga";
import passport from "passport";
import passportLocal from "passport-local";
import { prisma } from "./generated/prisma-client";
import { resolvers } from "./resolvers";

// Create a GraphQL-Yoga server
const createServer = async () => {
  // Set up passport for managing user authentication
  passport.use(
    // Authenticate against a emal address and password
    new passportLocal.Strategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          // Only retrieving a user with the submitted email address.
          const user = await prisma.user({ email });
          // Check if the user exist and return it content for use in subsequent request.
          if (user && (await bcrypt.compare(password, user.password))) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (e) {
          throw Error(e.message);
        }
      }
    )
  );

  // Create the server
  const server = new GraphQLServer({
    context: ({ request }) => ({
      prisma,
      user: request.user
    }),
    resolvers,
    typeDefs: __dirname + "/schema.graphql"
  });

  // Allow server to use the cors
  server.express.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", process.env.MMF_FRONTEND_HOST);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  // Handle JSON input
  server.express.use(bodyParser.json());

  // Make the server use the persisted session for subsequent requests
  server.express.use(
    session({
      cookie: {
        httpOnly: true,
        path: "/",
        sameSite: false,
        secure: false
      },
      name: "connect.sid",
      proxy: true,
      resave: true,
      rolling: false,
      saveUninitialized: true,
      secret: "" + process.env.SESSION_SECRET,
      store: new session.MemoryStore(),
      unset: "keep"
    })
  );

  // NB! Make sure this comes after the express session
  // Initialise the use of passport with the session
  server.express.use(passport.initialize());
  server.express.use(passport.session());

  // Serialize and deserialize for every request. Only the user id is stored
  // in the session.

  passport.serializeUser((user: { id: string }, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user({ id });
      done(null, user ? user : false);
    } catch (e) {
      throw Error(e.message);
    }
  });

  /**
   * Login endpoint.
   *
   * The request body must be a JSON object with the following fields:
   *
   * email: The email address.
   * password: The password.
   */
  server.express.post("/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) {
        return res.status(500).send({
          message:
            "You have not been logged in due to an internal server error.",
          success: false
        });
      } else if (!user) {
        return res.status(401).send({
          message: "The email address or password is incorrect.",
          success: false
        });
      } else {
        req.login(user, error => {
          if (error) {
            return next(error);
          }
          return res.send({
            message: "You have been logged in.",
            success: true
          });
        });
      }
    })(req, res, next);
  });

  /**
   * Logout endpoint.
   *
   * No request body is expected.
   */
  server.express.post("/auth/logout", (req, res) => {
    req.logout();
    res.send({
      message: "You have been logged out.",
      success: true
    });
  });

  /**
   * Terms and conditions endpoint.
   *
   * No request body is expected.
   */
  server.express.get("/termsandconditions", (req, res) => {
    // Download the data request file
    res.download("./src/termsandconditions.pdf", err => {
      if (err) {
        if (!res.headersSent) {
          res.status(404).send("File does not exist");
        } else {
          res.end();
        }
      }
    });
  });

  // Returning the server
  return server;
};

export default createServer;
