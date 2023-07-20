export type Config = {
  pipelines?: Pipeline[];
  crocuda?: Credentials[];
};
export interface Pipeline {
  name: string;
  event?: Event;
  steps: StepOrParallel[];
  triggers?: Trigger[];
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
}
export class Pipeline {
  name: string;
  event?: Event;
  status?: Status | string;
  steps: StepOrParallel[];
  triggers?: Trigger[];
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
  constructor(params: Pipeline) {
    this.name = params.name;
    this.triggers = params.triggers;
    this.event = params.event;
    this.steps = params.steps;
    this.status = params.status;
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
  actions?: Action[] | string[];
};
export type TriggerTag = {
  tags: string[];
  actions?: Action[] | string[];
};
export enum Action {
  applypatchMsg = "applypatch-msg",
  preApplypatch = "pre-applypatch",
  postApplyPatch = "post-apply-patch",
  preCommit = "pre-commit",
  prepareCommitMsg = "prepare-commit-msg",
  commitMsg = "commit-msg",
  postCommit = "post-commit",
  preRebase = "pre-rebase",
  postCheckout = "post-checkout",
  postMerge = "post-merge",
  preReceive = "pre-receive",
  update = "update",
  postReceive = "post-receive",
  postUpdate = "post-update",
  preAutoGc = "pre-auto-gc",
  postRewrite = "post-rewrite",
  prePush = "pre-push",
  manual = "manual",
  watch = "watch",
}

export type Mode = "stop" | "jump_next" | "continue";

export enum Status {
  Started = "Started",
  Running = "Running",
  Succeeded = "Succeeded",
  Aborted = "Aborted",
  Failed = "Failed",
}

export type Event = {
  trigger: Trigger;
  date: string;
  pid: number;
  pgid: number;
  sid: number;
};

export type Credentials = {
  user: string;
};
