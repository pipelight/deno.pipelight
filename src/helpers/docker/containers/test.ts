// Test
import {
  assert,
  assertIsError,
  fail,
} from "https://deno.land/std/assert/mod.ts";
// Self
import { Container } from "./mod.ts";
// Global
export * from "../globals.ts";

Deno.test("container class simple", () => {
  const container = new Container({
    name: "my_container",
    image: {
      name: "archlinux",
    },
  });
  assert(container);
});

Deno.test("containers array methods", () => {
  const containers = [
    new Container({
      name: "my_container",
      image: {
        name: "archlinux",
      },
    }),
  ];
  const res = containers.create();
  console.debug(res);
  assert(res);
});
