// Test
import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts";
// Self
import { unit } from "./mod.ts";
import { Docker, Container } from "../../docker/mod.ts";
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

Deno.test("init configuration", () => {
  let res = unit.init_config();
});

Deno.test("make routes", () => {
  unit.make_route(docker.containers.get("front")!);
});

Deno.test("make listeners", () => {
  unit.make_listener(docker.containers.get("front")!);
});
