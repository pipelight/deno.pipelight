import type { Config, Pipeline } from "./mod.ts";
import { Container, Docker, Network } from "./mod.ts";
import {
  // nginx_unit,
  parallel,
  pipeline,
  ssh,
  step,
} from "./mod.ts";

const docker = new Docker({
  globals: {
    dns: "example.com",
    version: "dev",
  },
  containers: [
    {
      suffix: "front",
      image: {
        suffix: "archlinux",
      },
      ports: [
        {
          in: 80,
          out: 8281,
        },
      ],
    },
  ],
});

// Execute tests
const tests = pipeline("test", () => [
  step("basic deno unit test suit", () => [
    "deno test --allow-all",
  ]),
  // test nginx-unit
  // self-signed dummy ssl cert generation
  // step("test nginx ssl", () => {
  //   const { expose } = nginx_unit();
  //   const container = docker.containers.get("front") as Container;
  //   return [...expose(container)];
  // }),
]);

const npm: Pipeline = pipeline("npm_publish", () => [
  step("generate npm package", () => ["deno run -A scripts/build_npm.ts"]),
]);

// Set triggers
tests.add_trigger!({
  branches: ["dev", "master"],
  actions: ["manual", "pre-push"],
});

const config = { pipelines: [tests, npm] };

export default config;

// config.pipelines?.push(tests);
