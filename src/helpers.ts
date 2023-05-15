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

export const ssh_wrapper = (host: string, cmd: string): string => {
  const suffix = "ssh -o TCPKeepAlive=no -C";
  return `${suffix} ${host} "${cmd}"`;
};
export const ssh = (hosts: string[], cmds: string[]): string[] => {
  const commands: string[] = [];
  for (const host of hosts) {
    for (const cmd of cmds) {
      commands.push(ssh_wrapper(host, cmd));
    }
  }
  return commands;
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
export const step = (
  name: string,
  fn: () => string[],
  options?: Omit<Step, "commands" | "name">
): Step => {
  const commands = fn();
  const s = {
    name,
    commands,
    ...options,
  };
  return s;
};
