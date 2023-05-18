import type { Config, Pipeline } from "https://deno.land/x/pipelight/mod.ts";
import { Docker, Container, Network } from "./src/docker/index.ts";
import { pipeline, step, ssh } from "./src/helpers.ts";

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
      ip: "127.0.0.1",
      image: {
        name: `pipelight/doc:${version}`,
      },
      ports: [{ out: 9080, in: 80 }],
    },
  ],
});

// Pipeline creation with Docker helpers
const compositionPipe = pipeline("composition", () => [
  step("create declaration files", () => ["tsc"]),
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
]);

const config: Config = {
  pipelines: [compositionPipe],
};

export default config;
