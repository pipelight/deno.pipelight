import { Action, Mode } from "./cast.ts";

export type Config = {
  pipelines?: Pipeline[];
};

export type Duration = {
  computed: string;
  started_at: string;
};
export type Pipeline = {
  name: string;
  steps: StepOrParallel[];
  triggers?: Trigger[];
  // Computed values
  event?: Event;
  status?: Status;
  duration?: Duration;
  // Fallbacks
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
};
export type StepOrParallel = Step | Parallel;
export type Parallel = {
  parallel: Step[];
  mode?: Mode;
  // Computed values
  status?: Status;
  duration?: Duration;
  // Fallbacks
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
};
export type Step = {
  name: string;
  commands: string[];
  mode?: Mode;
  // Computed values
  status?: Status;
  duration?: Duration;
  // Fallbacks
  on_started?: StepOrParallel[];
  on_failure?: StepOrParallel[];
  on_success?: StepOrParallel[];
  on_abortion?: StepOrParallel[];
};
export type Command = {
  // Computed values
  status?: Status;
  duration: Duration;
  // Internals
  stdin: string;
  stdout: string;
  stderr: string;
};
export type Trigger = TriggerBranch | TriggerTag;
export type TriggerTag = {
  tag: string[];
  action?: Action;
};
export type TriggerBranch = {
  tag: string[];
  action?: Action;
};
export type Event = {
  trigger: Trigger;
  date: string;
  pid: number;
  pgid: number;
  sid: number;
};
export enum Status {
  Started = "Started",
  Running = "Running",
  Succeeded = "Succeeded",
  Aborted = "Aborted",
  Failed = "Failed",
}
