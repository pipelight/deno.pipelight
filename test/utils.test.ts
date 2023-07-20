import { exists } from "../src/utils/index.ts";
Deno.test("url test", async () => {
  const image = {
    name: "alpine:latest",
  };
  await exists(image);
});
