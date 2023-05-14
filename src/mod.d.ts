declare type Config = {
    pipelines?: Pipeline[];
};
declare type Pipeline = {
    name: string;
    steps: StepOrParallel[];
    triggers?: Trigger[];
    on_failure?: StepOrParallel[];
    on_success?: StepOrParallel[];
    on_abortion?: StepOrParallel[];
};
declare type StepOrParallel = Step | Parallel;
declare type Parallel = {
    parallel: Step[];
    on_failure?: StepOrParallel[];
    on_success?: StepOrParallel[];
    on_abortion?: StepOrParallel[];
};
declare type Step = {
    non_blocking?: boolean;
    name: string;
    commands: string[];
    on_failure?: StepOrParallel[];
    on_success?: StepOrParallel[];
    on_abortion?: StepOrParallel[];
};
declare type Trigger = {
    branches?: string[];
    actions?: Action[];
};
declare type Action = "applypatch-msg" | "pre-applypatch" | "post-apply-patch" | "pre-commit" | "prepare-commit-msg" | "commit-msg" | "post-commit" | "pre-rebase" | "post-checkout" | "post-merge" | "pre-receive" | "update" | "post-receive" | "post-update" | "pre-auto-gc" | "post-rewrite" | "pre-push" | "manual";
export { exec } from "helpers";
export type { Config, Pipeline, StepOrParallel, Step, Parallel, Action, Trigger, };
