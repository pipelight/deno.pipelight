type Config = {
  pipelines?: Pipeline[];
};
type Pipeline = {
  name: string;
  steps: StepOrParallel[];
  triggers?: Trigger[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
};

type StepOrParallel = Step | Parallel;
type Parallel = {
  parallel: Step[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
};
type Step = {
  non_blocking?: boolean;
  force?: boolean;
  name: string;
  commands: string[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
};
type Trigger = {
  branches?: string[];
  actions?: Action[];
};
type Action =
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

export type {
  Config,
  Pipeline,
  StepOrParallel,
  Step,
  Parallel,
  Action,
  Trigger,
};
