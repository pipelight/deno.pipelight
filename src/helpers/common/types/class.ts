import type {
  // types
  Config as ConfigParams,
  Pipeline as PipelineParams,
  StepOrParallel as StepOrParallelParams,
  Parallel as ParallelParams,
  Step as StepParams,
  Trigger,
  TriggerBranch,
  TriggerTag,
} from "./cast.ts";
import {
  // enums
  Action,
  Mode,
} from "./cast.ts";

// Transform StepOrParallel[] to Step[] or Parallel[]
const to_step_or_parallel = (steps?: StepOrParallelParams[]) => {
  if (!!steps) {
    return steps.map((e) => {
      if ("parallel" in e) {
        return new Parallel(e);
      } else {
        return new Step(e);
      }
    });
  } else {
    return steps;
  }
};
export class Pipeline {
  name: string;
  steps: StepOrParallel[];
  triggers?: Trigger[];
  // Fallbacks
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
  constructor(params: PipelineParams) {
    this.name = params.name;
    this.steps = to_step_or_parallel(params.steps)!;
    this.triggers = params.triggers;
    // Fallbacks
    this.on_started = to_step_or_parallel(params.on_started);
    this.on_failure = to_step_or_parallel(params.on_failure);
    this.on_abortion = to_step_or_parallel(params.on_abortion);
    this.on_success = to_step_or_parallel(params.on_success);
  }
  add_trigger(trigger: Trigger) {
    if (!!this.triggers && this.triggers.length != 0) {
      this.triggers.push(trigger);
    } else {
      this.triggers = [trigger];
    }
    return this;
  }
}
export type StepOrParallel = Step | Parallel;
export class Parallel {
  parallel: Step[];
  mode?: Mode | string;
  // Fallbacks
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
  constructor(params: ParallelParams) {
    this.parallel = params.parallel.map((e: StepParams) => new Step(e));
    this.mode = params.mode;
    //Fallbacks
    this.on_started = to_step_or_parallel(params.on_started);
    this.on_failure = to_step_or_parallel(params.on_failure);
    this.on_abortion = to_step_or_parallel(params.on_abortion);
    this.on_success = to_step_or_parallel(params.on_success);
  }
  set_mode(mode: Mode | string) {
    this.mode = mode;
    return this;
  }
}
export class Step {
  name: string;
  commands: string[];
  mode?: Mode | string;
  // Fallbacks
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
  constructor(params: StepParams) {
    this.name = params.name;
    this.commands = params.commands;
    this.mode = params.mode;
    // Fallbacks
    this.on_started = to_step_or_parallel(params.on_started);
    this.on_failure = to_step_or_parallel(params.on_failure);
    this.on_abortion = to_step_or_parallel(params.on_abortion);
    this.on_success = to_step_or_parallel(params.on_success);
  }
  set_mode(mode: Mode | string) {
    this.mode = mode;
    return this;
  }
}
