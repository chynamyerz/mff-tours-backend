// tslint:disable-next-line:no-var-requires
require("now-env");
import createServer from "./createServer";

const launchServer = async () => {
  // Instatiate the server
  const server = createServer();

  const opts: any = {
    cors: {
      credentials: true,
      origin: [process.env.MMF_FRONTEND_HOST]
    }
  };

  // Start the server with CORS enabled
  (await server).start(opts);
};

launchServer();
