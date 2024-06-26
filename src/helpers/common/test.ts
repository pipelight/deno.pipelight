// Test
import { assertEquals } from "https://deno.land/std/assert/mod.ts";
// Self
import { parallel, pipeline, step } from "./mod.ts";
import { Pipeline } from "./types/class.ts";
import { Mode } from "./types/cast.ts";

Deno.test("chain_pipeline_add_trigger_method", () => {
  const res = pipeline("test", () => [step("test", () => ["test"])])
    //First trigger
    .add_trigger({
      branches: ["master"],
      actions: ["pre-push"],
    })
    //Second trigger
    .add_trigger({
      branches: ["master"],
      actions: ["pre-push"],
    });
});

Deno.test("step_set_mode_method", () => {
  const res = step("test", () => ["test"]).set_mode(Mode.StopOnFailure);
});


Deno.test("pipeline_and_step_helpers", () => {
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
