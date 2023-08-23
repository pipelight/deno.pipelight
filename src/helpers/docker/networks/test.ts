// Test
import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts";
// Self
import { Docker } from "../docker/mod.ts";
// Global
export * from "../globals.ts";

Deno.test("create", () => {
  const docker = new Docker({
    networks: [
      {
        name: "my_net",
      },
    ],
  });
  const res = [...docker.networks.create()];
  // console.debug(res);
  assert(res);
});
