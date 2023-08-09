import type {
  Config,
  Pipeline,
  StepOrParallel,
  Parallel,
  Step,
} from "../../../mod.ts";

import {
  // class
  ConfigClass,
  PipelineClass,
  ParallelClass,
  StepClass,
} from "../../../mod.ts";

// When multiple ssh session are requested by pipelight, it goes to fast for the tcp connection to keep up.
// It needs to be killed before requesting for another  -> "keepAlive = No"
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
export const configuration = (
  fn: () => Pipeline[],
  options?: Omit<Config, "pipelines">
): Config => {
  const pipelines = fn().map((e) => new PipelineClass(e));
  const config = {
    pipelines,
    ...options,
  };
  // export default config;
  return config;
};

export const pipeline = (
  name: string,
  fn: () => StepOrParallel[],
  options?: Omit<Pipeline, "steps" | "name">
): PipelineClass => {
  const steps = fn();
  const p: Pipeline = new PipelineClass({
    name,
    steps: steps as StepOrParallel[],
    ...options,
  });
  return p;
};
export const step = (
  name: string,
  fn: () => string[],
  options?: Omit<Step, "commands" | "name">
): StepClass => {
  const commands = fn();
  const s = new StepClass({
    name,
    commands,
    ...options,
  });
  return s;
};
export const parallel = (fn: () => Step[]): ParallelClass => {
  const parallel = fn();
  const p = new ParallelClass({
    parallel: parallel as Step[],
  });
  return p;
};
