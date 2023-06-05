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
    get<T>(key: string): T;
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
// Container
Array.prototype.get = function <T>(suffix: string): T {
  let full_name: string;
  if (!!this.ctx) {
    full_name = `${this.ctx.version}.${suffix}.${this.ctx.dns}`;
  } else {
    full_name = suffix;
  }
  return this.find((e) => e.name == full_name);
};
// Volumes
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
