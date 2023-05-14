import type { Config, Pipeline } from "npm:pipelight";
import { Docker, Container, Network } from "./src/framework/docker.ts";
import { pipeline, step } from "./src/framework/docker.ts";

const version = "production";
const service = "deno";
const dns = "pipelight.dev";
const params = {
  host: "linode",
  dns: "pipelight.dev",
  version: version,
};

const docker = new Docker({
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
// const docker = new Docker("myapp");
// const front = new Container("front");
// docker.containers.push(front);
// docker.networks.push(new Network("my_network"));

const compositionPipe = pipeline("composition", () => [
  step("test", () => ["ls", "cmd"]),
  step("classes", () => docker.to_commands()),
]);

const config: Config = {
  pipelines: [compositionPipe],
};

export default config;
