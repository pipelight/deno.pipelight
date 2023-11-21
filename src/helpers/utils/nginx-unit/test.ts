// Test
import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts";
// Self
import { make_unit } from "./mod.ts";
import { Container, Docker } from "../../docker/mod.ts";
import { Globals, Port } from "../../docker/mod.ts";

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

const {
  init_config,
  make_route,
  make_listener,
} = make_unit();
Deno.test("init configuration", () => {
  let res = init_config();
});

Deno.test("make routes", () => {
  const res = make_route(docker.containers.get("front")!);
  for (const cmd of res) {
    console.log(cmd);
  }
});

Deno.test("make listeners", () => {
  const res = make_listener(docker.containers.get("front")!);
  for (const cmd of res) {
    console.log(cmd);
  }
});
