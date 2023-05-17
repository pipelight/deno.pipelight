import type { Step } from "./types/index.ts";
export declare const exec: (cmd: string) => Promise<string>;
export declare const ssh_wrapper: (host: string, cmd: string) => string;
export declare const ssh: (hosts: string[], cmds: string[]) => string[];
export declare const pipeline: (name: string, fn: () => Step[]) => Pipeline;
export declare const step: (name: string, fn: () => string[], options?: Omit<Step, "commands" | "name">) => Step;
