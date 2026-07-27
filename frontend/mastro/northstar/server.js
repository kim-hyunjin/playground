import "urlpattern-polyfill";
import * as http from "node:http";
import { createRequestListener } from "@remix-run/node-fetch-server";

const { default: mastro } = await import("@mastrojs/mastro/server");
const port = Number(process.env.PORT || 8000);
const server = http.createServer(createRequestListener(mastro.fetch));

server.on("error", (error) => {
  console.error(error);
});

server.listen(port, () => {
  console.log(`Northstar is live at http://localhost:${port}`);
});
