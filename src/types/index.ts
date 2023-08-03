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
  // mail hooks
  ApplypatchMsg = "applypatch-msg",
  PreApplypatch = "pre-applypatch",
  PostApplypatch = "post-applypatch",
  SendemailValidate = "sendemail-validate",
  // client hooks
  PreCommit = "pre-commit",
  PreMergeCommit = "pre-merge-commit",
  PrepareCommitMsg = "prepare-commit-msg",
  CommitMsg = "commit-msg",
  PostCommit = "post-commit",
  // other client hooks
  PreRebase = "pre-rebase",
  PostCheckout = "post-checkout",
  PostMerge = "post-merge",
  PrePush = "pre-push",
  PostRewrite = "post-rewrite",
  PreAutoGc = "pre-auto-gc",
  FsmonitorWatchman = "fsmonitor-watchman",
  PostIndexChange = "past-index-change",
  // p4
  P4Changelist = "p4-changelist",
  P4PrepareChangelist = "p4-prepare-changelist",
  P4PostChangelist = "p4-post-changelist",
  P4PreSubmit = "p4-pre-submit",
  // server-side hooks
  PreReceive = "pre-receive",
  Update = "update",
  ProcReceive = "proc-receive",
  PostReceive = "post-receive",
  PostUpdate = "post-update",
  RefrenceTransaction = "reference-transaction",
  PushToCheckout = "push-to-checkout",
  // special flags
  Manual = "manual",
  Watch = "watch",
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

export enum Verbosity {
  Error,
  Warn,
  Info,
  Debug,
  Trace,
}
