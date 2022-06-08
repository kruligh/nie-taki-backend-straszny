import { createServer } from "http";
import { buildRouter } from "ntbs/router";
import { buildAppServices } from "ntbs/app-services";

async function main() {
  const httpPort = 8082; // todo move to env
  const appServices = await buildAppServices();
  const router = await buildRouter(appServices);

  const server = createServer(router);
  server.listen(httpPort, () => {
    console.log(
      `Server is running at http://localhost:${httpPort} in ${appServices.appConfig.environment} mode`
    );
  });
}

main()
  .then(() => console.log("Server running"))
  .catch(err => {
    console.error("Server failed", err);
    process.exit(1);
  });
