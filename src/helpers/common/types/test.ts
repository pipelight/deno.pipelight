import type { Pipeline } from "./mod.ts";

Deno.test("pipeline typing", () => {
  const pipeline: Pipeline = {
    name: "test",
    steps: [
      {
        name: "test",
        commands: ["test"],
      },
    ],
  };
});
