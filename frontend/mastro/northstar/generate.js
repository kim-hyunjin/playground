import "urlpattern-polyfill";
import { generate } from "@mastrojs/mastro/generator";
import { mkdir, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await generate({ outFolder: "dist/client" });
await mkdir("dist/server", { recursive: true });
await writeFile(
  "dist/server/index.js",
  `export default {
  fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
`,
);
