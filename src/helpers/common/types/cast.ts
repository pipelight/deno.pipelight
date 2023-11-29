export type Config = {
  pipelines?: Pipeline[];
};

export interface PipelineOpts {
  attach?: boolean;
  log_level?: LogLevel | string;
}

export interface StepOpts {
  mode?: Mode | string;
}
export interface Pipeline {
  name: string;
  steps: StepOrParallel[];
  triggers?: Trigger[];
  options?: PipelineOpts;
  // Fallbacks
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
}
export type StepOrParallel = Step | Parallel;
export type Parallel = {
  parallel: Step[];
  mode?: Mode | string;
  // Fallbacks
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
};
export type Step = {
  name: string;
  commands: string[];
  mode?: Mode | string;
  // Fallbacks
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
};
export type Trigger = TriggerBranch | TriggerTag;
export type TriggerBranch = {
  branches?: string[];
  actions?: Array<Action | string>;
};
export type TriggerTag = {
  tags?: string[];
  actions?: Array<Action | string>;
};
export enum LogLevel {
  Off = "off",
  Error = "error",
  Warn = "warn",
  Info = "info",
  Debug = "debug",
  Trace = "debug",
}
export enum Mode {
  StopOnFailure = "stop",
  JumpNextOnFailure = "jump_next",
  ContinueOnFailure = "continue",
}
// Converted to kebab-case
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
  Blank = "blank",
}
