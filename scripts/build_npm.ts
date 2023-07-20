// ex. scripts/build_npm.ts
// deno run -A scripts/build_npm.ts
// from https://github.com/denoland/dnt/
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";
await emptyDir("./npm");
await build({
  entryPoints: ["./mod.ts"],
  scriptModule: false,
  outDir: "./npm",
  compilerOptions: { lib: ["esnext", "DOM"] },
  shims: {
    // see JS docs for overview and more options
    crypto: "dev",
    deno: "dev",
  },
  package: {
    // package.json properties
    name: "pipelight",
    keywords: [
      "cicd",
      "bash",
      "bash wrapper",
      "git hooks",
      "simple",
      "easy",
      "deployment",
      "typescript",
    ],
    version: "0.6.1-2",
    description: "Type definition for Pipelight",
    author: "Areskul <areskul@areskul.com>",
    license: "MIT",
    sideEffects: false,
    repository: {
      type: "git",
      url: "git+https://github.com/username/repo.git",
    },
    homepage: "https://pipelight.dev",
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
