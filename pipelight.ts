import type { Config, Pipeline } from "./mod.ts";
import { Docker, Container, Network } from "./mod.ts";
import { pipeline, step, ssh } from "./mod.ts";

// Global vars
const version = "production";
const service = "deno";
const dns = "pipelight.dev";
const params = {
  host: "linode",
  dns: "pipelight.dev",
  version: version,
};

// Docker object creation
const docker = new Docker({
  images: [
    {
      name: `pipelight/doc:${version}`,
    },
  ],
  containers: [
    {
      name: `${version}.${service}.${dns}`,
      image: {
        name: `pipelight/doc:${version}`,
      },
      ports: [{ out: 9080, in: 80 }],
    },
  ],
});

// Pipeline creation with Docker helpers
const compositionPipe = pipeline(
  "composition",
  () => [
    step("create declaration files", () => ["tsc --no-emit"], {
      mode: "continue",
    }),
    // Create images locally and send it to remotes
    step("build and send images", () => [
      ...docker.images.create(),
      ...docker.images.send(["localhost"]),
    ]),
    step(
      "replace containers",
      () =>
        ssh(
          ["localhost"],
          [...docker.containers.remove(), ...docker.containers.create()]
        ),
      {
        mode: "continue",
      }
    ),
  ],
  {
    triggers: [
      {
        branches: ["dev"],
        actions: ["manual"],
      },
      {
        tags: ["*"],
        actions: ["pre-push"],
      },
    ],
  }
);

const config: Config = {
  pipelines: [compositionPipe],
};

export default config;
