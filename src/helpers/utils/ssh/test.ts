// Test
import { assertEquals } from "https://deno.land/std/assert/mod.ts";
// Self
import { ssh } from "./mod.ts";

Deno.test("ssh helper", () => {
  const cmds = ['ssh -o TCPKeepAlive=no -C my_host "my_cmd"'];
  const res = ssh("my_host", () => ["my_cmd"]);

  assertEquals(cmds, res);
});
