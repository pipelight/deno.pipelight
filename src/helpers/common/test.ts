// Test
import { assertEquals } from "https://deno.land/std/assert/mod.ts";
// Self
import { ssh } from "./mod.ts";
// Self
import { pipeline, step, parallel } from "./mod.ts";
import { Pipeline } from "../../types/class.ts";

Deno.test("chain pipeline triggers declaration", () => {
  const res = pipeline("test", () => [step("test", () => ["test"])])
    //First trigger
    .trigger({
      branches: ["master"],
      actions: ["pre-push"],
    })
    //Second trigger
    .trigger({
      branches: ["master"],
      actions: ["pre-push"],
    });
});

Deno.test("common pipeline helpers", () => {
  const instance = new Pipeline({
    name: "test",
    steps: [
      {
        name: "test",
        commands: ["test"],
      },
      {
        parallel: [
          {
            name: "test",
            commands: ["test"],
          },
        ],
      },
    ],
  });
  const res =
    // pipeline helper
    pipeline("test", () => [
      // step helper
      step("test", () => ["test"]),
      // parallel helper
      parallel(() => [
        // step helper inside parallel
        step("test", () => ["test"]),
      ]),
    ]);

  assertEquals(instance, res);
});

Deno.test("ssh helper", () => {
  const cmds = ['ssh -o TCPKeepAlive=no -C my_host "my_cmd"'];
  const res = ssh("my_host", () => ["my_cmd"]);

  assertEquals(cmds, res);
});
