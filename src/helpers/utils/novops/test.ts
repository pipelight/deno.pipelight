// Test
import { assert, assertEquals } from "https://deno.land/std/assert/mod.ts";
// Self
import { novops } from "./mod.ts";

Deno.test("novops helper", () => {
  const cmds = ["novops run -- my_cmd"];
  const res = novops(() => ["my_cmd"]);
  assertEquals(cmds, res);
});
