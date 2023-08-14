// Test
import { assert } from "https://deno.land/std/assert/mod.ts";
// Self
import { Container } from "./mod.ts";

Deno.test("container class simple", () => {
  const container = new Container({
    name: "my_container",
    image: {
      name: "archlinux",
    },
  });
  assert(container);
});
