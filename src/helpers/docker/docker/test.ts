// Test
import { assert } from "https://deno.land/std/assert/mod.ts";
// Self
import { Docker } from "./mod.ts";
// Global
export * from "../globals.ts";

Deno.test("top_scope_docker_methods", () => {
  const docker = new Docker({
    containers: [
      {
        name: "my_container",
        image: {
          name: "archlinux",
        },
      },
    ],
  });
  const res = [...docker.update(), ...docker.upgrade()];
  console.debug(res);
  assert(res);
});

Deno.test("top_scope_container_array_methods", () => {
  const docker = new Docker({
    containers: [
      {
        name: "my_container",
        image: {
          name: "archlinux",
        },
      },
    ],
  });
  const res = docker.containers.create();
  console.debug(res);
  assert(res);
});
