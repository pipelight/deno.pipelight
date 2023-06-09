export type Config = {
  pipelines?: Pipeline[];
};
export interface Pipeline {
  name: string;
  steps: StepOrParallel[];
  triggers?: Trigger[];
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
}
export class Pipeline {
  name: string;
  steps: StepOrParallel[];
  triggers?: Trigger[];
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
  constructor(params: Pipeline) {
    this.name = params.name;
    this.triggers = params.triggers;
    this.steps = params.steps;
    this.on_started = params.on_started;
    this.on_failure = params.on_failure;
    this.on_abortion = params.on_abortion;
    this.on_success = params.on_success;
    this.on_abortion = params.on_abortion;
  }
  add_trigger?(trigger: Trigger) {
    if (!!this.triggers && this.triggers.length != 0) {
      this.triggers.push(trigger);
    } else {
      this.triggers = [trigger];
    }
  }
}

export type StepOrParallel = Step | Parallel;
export type Parallel = {
  parallel: Step[];
  mode?: Mode;
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
};
export type Step = {
  name: string;
  commands: string[];
  mode?: Mode;
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
};
export type Trigger = TriggerBranch | TriggerTag;
export type TriggerBranch = {
  branches: string[];
  actions?: Action[];
};
export type TriggerTag = {
  tags: string[];
  actions?: Action[];
};
export type Action =
  | "applypatch-msg"
  | "pre-applypatch"
  | "post-apply-patch"
  | "pre-commit"
  | "prepare-commit-msg"
  | "commit-msg"
  | "post-commit"
  | "pre-rebase"
  | "post-checkout"
  | "post-merge"
  | "pre-receive"
  | "update"
  | "post-receive"
  | "post-update"
  | "pre-auto-gc"
  | "post-rewrite"
  | "pre-push"
  | "manual";

export type Mode = "stop" | "jump_next" | "continue";
