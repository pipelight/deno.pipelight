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
  }
}

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
Array.prototype.send = function (hosts: string[]): string[] {
  const commands: string[] = [];
  for (const e of this) {
    commands.push(...e.send(hosts));
  }
  return commands;
};
Array.prototype.get = function (suffix: string) {
  let full_name: string;
  if (!!this.ctx) {
    full_name = `${this.ctx.version}.${suffix}.${this.ctx.dns}`;
  } else {
    full_name = suffix;
  }
  return this.find((e) => e.name == full_name);
};
