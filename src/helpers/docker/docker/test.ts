// Test
import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts";
// Self
import { Docker } from "./mod.ts";
import { Image } from "../images/mod.ts";
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
  const res = [...docker.containers.create()];
  // console.debug(res);
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
  // console.debug(res);
  assert(res);
});

Deno.test("loose:pass_container_suffix_down_to_image", () => {
  const docker = new Docker({
    globals: {
      version: "production",
      dns: "example.com",
    },
    containers: [
      {
        suffix: "api",
      },
    ],
  });
  // use getter
  const image = docker.images.get("api") as Image;
  assertEquals(image.name, "example.com/api:production");
});

Deno.test("update", () => {
  const docker = new Docker({
    globals: {
      version: "production",
      dns: "example.com",
    },
    containers: [
      {
        suffix: "api",
      },
    ],
  });
  // use getter
  const image = docker.images.get("api") as Image;
  assertEquals(image.name, "example.com/api:production");
});
