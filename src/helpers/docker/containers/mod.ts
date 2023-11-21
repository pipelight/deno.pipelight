import {
  MountVolumeAutoParams,
  MountVolumeParams,
  VolumeParams,
} from "../volumes/mod.ts";
import { ImageAutoParams, ImageParams } from "../images/mod.ts";
import {
  MountNetworkAutoParams,
  MountNetworkParams,
  Port,
  PortParams,
} from "../networks/mod.ts";
import type { Globals } from "../globals.ts";

// UUID
import { v1 } from "https://deno.land/std/uuid/mod.ts";

/**
Parameter used in DockerAutoParams.
*/
export interface ContainerAutoParams {
  suffix: string;
  image?: ImageAutoParams;
  volumes?: Array<MountVolumeAutoParams | MountVolumeParams>;
  networks?: Array<MountNetworkAutoParams | MountNetworkParams>;
  ports?: PortParams[];
  envs?: string[];
  args?: Record<string, string>[];
  globals?: Globals;
}
export interface ContainerParams {
  name: string;
  image: Pick<ImageParams, "name">;
  networks?: MountNetworkParams[];
  volumes?: MountVolumeParams[];
  ports?: PortParams[];
  envs?: string[];
  args?: Record<string, string>[];
  globals?: Globals;
}

export class Container implements ContainerParams {
  id: string = v1.generate() as string;
  name: string;
  image: Pick<ImageParams, "name">;
  networks?: MountNetworkParams[];
  volumes?: MountVolumeParams[];
  ports?: Port[];
  envs?: string[];
  args?: Record<string, string>[];
  globals?: Globals;
  constructor(params: ContainerParams) {
    this.name = params.name;
    this.image = params.image;
    this.volumes = params.volumes;
    this.networks = params.networks;
    if (!!params.ports) {
      this.ports = [];
      for (const port of params.ports) {
        this.ports.push(new Port(port));
      }
    }
    // handcraft
    this.envs = params.envs;
    this.args = params.args;
    // ctx
    this.globals = params.globals;
  }
  // Create container and Run it
  create(): string[] {
    const cmds: string[] = [];
    let str = `docker run \ `;
    str += `--detach \ `;
    if (!!this.ports) {
      for (const port of this.ports) {
        str += `--publish ${port.ip}:${port.out}:${port.in} \ `;
      }
    }
    if (!!this.networks) {
      for (const network of this.networks) {
        str += `--network ${network.name} \ `;
        if (!!network.ip) {
          str += `--ip ${network.ip} \ `;
        }
      }
    }
    if (!!this.volumes) {
      for (const volume of this.volumes) {
        // Check if named volume or bind mount
        str += `--volume ${volume.name}:${volume.target} \ `;
      }
    }
    if (!!this.args) {
      for (const [key, value] of Object.entries(this.args)) {
        str += `--${key} ${value} \ `;
      }
    }
    if (!!this.envs) {
      for (const env of this.envs) {
        str += `--env ${env} \ `;
      }
    }
    str += `--name ${this.name} \ `;
    str += this.image.name;
    cmds.push(str);
    return cmds;
  }
  // Delete container
  remove(): string[] {
    const cmds: string[] = [];
    let str = `docker container stop ${this.name}` +
      " && " +
      `docker container rm ${this.name}`;
    cmds.push(str);
    return cmds;
  }
  restart(): string[] {
    const cmds: string[] = [];
    let str = `docker container restart ${this.name}`;
    cmds.push(str);
    return cmds;
  }
  exec(cmds: () => string[]): string[] {
    const wrapped_cmds: string[] = [];
    for (const cmd of wrapped_cmds) {
      let str = `docker container exec ${this.name} \ `;
      str += cmd;
      wrapped_cmds.push(str);
    }
    return wrapped_cmds;
  }
}

// Container
export const get_container = (
  array: Container[],
  suffix: string,
): Container | undefined => {
  let full_name: string;
  if (!!array.ctx) {
    full_name = `${array.ctx.version}.${suffix}.${array.ctx.dns}`;
  } else {
    full_name = suffix;
  }
  return array.find((e) => e.name == full_name);
};
