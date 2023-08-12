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
  cmds: () => string[],
  options?: Omit<Step, "commands" | "name">
): StepClass => {
  const commands: string[] = cmds();
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
