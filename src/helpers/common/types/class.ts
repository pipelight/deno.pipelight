import type {
  // types
  Parallel as ParallelParams,
  Pipeline as PipelineParams,
  PipelineOpts,
  Step as StepParams,
  StepOpts,
  StepOrParallel as StepOrParallelParams,
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
  if (steps) {
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
  //Options
  options?: PipelineOpts;
  constructor(params: PipelineParams) {
    this.name = params.name;
    this.steps = to_step_or_parallel(params.steps)!;
    this.triggers = params.triggers;
    // Fallbacks
    this.on_started = to_step_or_parallel(params.on_started);
    this.on_failure = to_step_or_parallel(params.on_failure);
    this.on_abortion = to_step_or_parallel(params.on_abortion);
    this.on_success = to_step_or_parallel(params.on_success);
    // Options
    this.options = params.options;
  }
  add_trigger(trigger: Trigger) {
    if (!!this.triggers && this.triggers.length != 0) {
      this.triggers.push(trigger);
    } else {
      this.triggers = [trigger];
    }
    return this;
  }
  set_options(args: PipelineOpts) {
    this.options = args;
    return this;
  }
  attach() {
    // guard
    if (!this.options) {
      this.options = {};
    }
    this.options!.attach = true;
    return this;
  }
  log_level(level: string) {
    // guard
    if (!this.options) {
      this.options = {};
    }
    this.options!.log_level = level;
    return this;
  }
  detach() {
    // guard
    if (!this.options) {
      this.options = {};
    }
    this.options!.attach = false;
    return this;
  }
}
export type StepOrParallel = Step | Parallel;
export class Parallel {
  parallel: Step[];
  // Fallbacks
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];

  constructor(params: ParallelParams) {
    this.parallel = params.parallel.map((e: StepParams) => new Step(e));
    //Fallbacks
    this.on_started = to_step_or_parallel(params.on_started);
    this.on_failure = to_step_or_parallel(params.on_failure);
    this.on_abortion = to_step_or_parallel(params.on_abortion);
    this.on_success = to_step_or_parallel(params.on_success);
  }
}
export class Step {
  name: string;
  commands: string[];
  //Options
  options?: StepOpts;
  // Fallbacks
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
  constructor(params: StepParams) {
    this.name = params.name;
    this.commands = params.commands;
    // Options
    this.options = params.options;
    // Fallbacks
    this.on_started = to_step_or_parallel(params.on_started);
    this.on_failure = to_step_or_parallel(params.on_failure);
    this.on_abortion = to_step_or_parallel(params.on_abortion);
    this.on_success = to_step_or_parallel(params.on_success);
  }
  set_mode(mode: Mode | string) {
    // guard
    if (!this.options) {
      this.options = {};
    }
    this.options.mode = mode;
    return this;
  }
}
