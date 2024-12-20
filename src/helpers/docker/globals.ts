import { Container, get_container } from "./containers/mod.ts";
import { get_volume, Volume } from "./volumes/mod.ts";
import { get_image, Image } from "./images/mod.ts";

export const uniqBy = <T>(a: Array<T>, key: string): Array<T> => {
  let seen = new Set();
  return a.filter((item) => {
    let k: any = item[key as keyof T];
    return seen.has(k) ? false : seen.add(k);
  });
};

export interface Globals {
  version: string;
  // version: production
  dns: string;
  // dns: pipelight.dev
}

declare global {
  export interface Array<T> {
    ctx: Record<string, any>;
    dedup<T>(key?: string): Array<T>;
    remove(): string[];
    create(): string[];
    send(remote: string): string[];
    get<T>(key: string, key2?: string): T | undefined;
    backup(): string[];
    restore(): string[];
  }
}

// Global
Array.prototype.ctx = {};

Array.prototype.dedup = function <T>(key?: string): Array<T> {
  return uniqBy(this, !!key ? key : "name");
};
Array.prototype.remove = function (): string[] {
  const commands: string[] = [];
  for (const e of this) {
    commands.push(...e.remove());
  }
  return commands;
};
Array.prototype.create = function (): string[] {
  const commands: string[] = [];
  for (const e of this) {
    commands.push(...e.create());
  }
  return commands;
};
// Image
Array.prototype.send = function (host: string): string[] {
  const commands: string[] = [];
  for (const e of this) {
    commands.push(...e.send(host));
  }
  return commands;
};

Array.prototype.get = function <T>(
  suffix: string,
  container_suffix?: string,
): T | undefined {
  if (this[0] instanceof Image) {
    // @ts-ignore
    return get_image(this, suffix);
  }
  if (this[0] instanceof Container) {
    // @ts-ignore
    return get_container(this, suffix);
  }
  if (this[0] instanceof Volume) {
    // @ts-ignore
    return get_volume(this, suffix, container_suffix!);
  }
};

Array.prototype.backup = function (): string[] {
  const commands: string[] = [];
  for (const e of this) {
    commands.push(...e.backup());
  }
  return commands;
};
Array.prototype.restore = function (): string[] {
  const commands: string[] = [];
  for (const e of this) {
    commands.push(...e.restore());
  }
  return commands;
};
