declare type Config = {
    pipelines?: Pipeline[];
};
declare type Pipeline = {
    name: string;
    steps: StepOrParallel[];
    triggers?: Trigger[];
    on_started?: StepOrParallel[];
    on_failure?: StepOrParallel[];
    on_success?: StepOrParallel[];
    on_abortion?: StepOrParallel[];
};
declare type StepOrParallel = Step | Parallel;
declare type Parallel = {
    mode?: Mode;
    parallel: Step[];
    on_started?: StepOrParallel[];
    on_failure?: StepOrParallel[];
    on_success?: StepOrParallel[];
    on_abortion?: StepOrParallel[];
};
declare type Step = {
    mode?: Mode;
    name: string;
    commands: string[];
    on_started?: StepOrParallel[];
    on_failure?: StepOrParallel[];
    on_success?: StepOrParallel[];
    on_abortion?: StepOrParallel[];
};
declare type Trigger = {
    branches?: string[];
    actions?: Action[];
};
declare type Mode = "stop" | "jump_next" | "continue";
declare type Action = "applypatch-msg" | "pre-applypatch" | "post-apply-patch" | "pre-commit" | "prepare-commit-msg" | "commit-msg" | "post-commit" | "pre-rebase" | "post-checkout" | "post-merge" | "pre-receive" | "update" | "post-receive" | "post-update" | "pre-auto-gc" | "post-rewrite" | "pre-push" | "manual";
export type { Config, Pipeline, StepOrParallel, Step, Parallel, Action, Trigger, };
