import { Container, Volume } from "../helpers/docker/mod.ts";

export const get_subnet = (ip: string): string => {
  const splitted = ip.split(".");
  const base = splitted.slice(0, splitted.length - 1).join(".");
  const subnet = base + ".0/24";
  return subnet;
};
export const uniqBy = <T>(a: Array<T>, key: string): Array<T> => {
  let seen = new Set();
  return a.filter((item) => {
    let k: any = item[key as keyof T];
    return seen.has(k) ? false : seen.add(k);
  });
};

declare global {
  export interface Array<T> {
    ctx: Record<string, any>;
    dedup<T>(key?: string): Array<T>;
    remove(): string[];
    create(): string[];
    send(remote: string[]): string[];
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
Array.prototype.send = function (hosts: string[]): string[] {
  const commands: string[] = [];
  for (const e of this) {
    commands.push(...e.send(hosts));
  }
  return commands;
};

Array.prototype.get = function <T>(
  suffix: string,
  container_suffix?: string
): T | undefined {
  if (this[0] instanceof Container) {
    // @ts-ignore
    return get_container(this, suffix);
  }
  if (this[0] instanceof Volume) {
    // @ts-ignore
    return get_volume(this, suffix, container_suffix!);
  }
};

// Container
const get_container = (
  array: Container[],
  suffix: string
): Container | undefined => {
  let full_name: string;
  if (!!array.ctx) {
    full_name = `${array.ctx.version}.${suffix}.${array.ctx.dns}`;
  } else {
    full_name = suffix;
  }
  return array.find((e) => e.name == full_name);
};
// Volumes
const get_volume = (
  array: Volume[],
  suffix: string,
  container_suffix: string
): Volume | undefined => {
  let full_name: string;
  if (!!array.ctx) {
    full_name = `${array.ctx.version}_${container_suffix}_${array.ctx.dns}__${suffix}`;
  } else {
    full_name = suffix;
  }
  return array.find((e) => e.name == full_name);
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
