import { exists } from "../src/utils/index.ts";

const image = {
  name: "alpine:latest",
};
await exists(image);
