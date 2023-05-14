import type { Pipeline, Step } from "./types/index.ts";
// Execute a bash string through deno
export const exec = async (cmd: string) => {
  const process = new Deno.Command("sh", {
    args: ["-c", cmd],
  });
  const { code, stdout, stderr } = await process.output();
  const res = new TextDecoder().decode(stdout).replace(/\s+$/, "");
  const err = new TextDecoder().decode(stderr).replace(/\s+$/, "");
  if (!code) {
    return res;
  } else {
    return err;
  }
};
// SSh helper
export interface SshParams {
  host: string;
  cmd: string;
}
export const ssh = (params: SshParams) => {
  const suffix = "ssh -o TCPKeepAlive=no -C";
  return `${suffix} ${params.host} "${params.cmd}"`;
};

// Composition api
export const pipeline = (name: string, fn: () => Step[]): Pipeline => {
  const steps = fn();
  const p: Pipeline = {
    name,
    steps,
  };
  return p;
};
export const step = (name: string, fn: () => string[]): Step => {
  const commands = fn();
  const s = {
    name,
    commands,
  };
  return s;
};
