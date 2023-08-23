// Test
import {
  assert,
  assertIsError,
  fail,
} from "https://deno.land/std/assert/mod.ts";
// Self
import { Volume } from "./mod.ts";
// Global
export * from "../globals.ts";

Deno.test("create", () => {
  const volumes = [
    new Volume({
      name: "my_vol",
    }),
  ];
  const res = volumes.create();
  assert(res);
});

Deno.test("backup", () => {
  const volumes = [
    new Volume({
      name: "my_vol",
    }),
  ];
  const res = volumes.backup();
  assert(res);
});
