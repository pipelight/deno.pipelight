// Common helpers
import { ssh } from "../common/mod.ts";

export interface ImageAutoParams {
  suffix: string;
  file?: string;
}
export interface ImageParams {
  name: string;
  file?: string;
}
export class Image implements ImageParams {
  name: string;
  file?: string;
  constructor(params: ImageParams) {
    this.name = params.name;
    this.file = params.file;
  }
  create(): string[] {
    const cmds: string[] = [];
    let str = `docker build \ `;
    str += `--tag ${this.name} \ `;
    if (!!this.file) {
      str += `--file ${this.file} \ `;
    }
    str += ` .`;
    cmds.push(str);
    return cmds;
  }
  remove(): string[] {
    const cmds: string[] = [];
    let str = `docker image rm ${this.name}`;
    cmds.push(str);
    return cmds;
  }
  send(hosts: string[]): string[] {
    const cmds: string[] = [];
    for (const host of hosts) {
      let str = `docker save ${this.name}`;
      str += " | " + ssh([host], ["docker load"]);
      cmds.push(str);
    }
    return cmds;
  }
}
