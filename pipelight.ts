import type { Config, Pipeline } from "./mod.ts";
import { Docker, Container, Network } from "./mod.ts";
import { pipeline, parallel, step, ssh } from "./mod.ts";

// Global vars
const globals = {
  version: "production",
  service: "deno",
};

// const config: Config = {
//   pipelines: [],
// };

// Execute tests
const tests = pipeline("test", () => [
  parallel(() => [
    step("test_docker+_helpers", () => [
      "deno run --allow-all ./test/service.test.ts",
    ]),
    step("test_deployment_pipeline", () => [
      "deno run --allow-all ./test/deploy.test.ts",
    ]),
    step("test_utils", () => ["deno run --allow-all ./test/utils.test.ts"]),
  ]),
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
