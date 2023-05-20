// import { ssh } from "@helpers";
import { ssh } from "../index.ts";

declare global {
  export interface Array<T> {
    remove(): string[];
    create(): string[];
    send(remote: string[]): string[];
  }
}
Array.prototype.remove = function (): string[] {
  // Containers methods
  const commands: string[] = [];
  if (this.length != 0) {
    for (const e of this) {
      commands.push(...e.remove());
    }
  }
  return commands;
};
Array.prototype.create = function (): string[] {
  // Containers methods
  const commands: string[] = [];
  if (this.length != 0) {
    for (const e of this) {
      commands.push(...e.create());
    }
  }
  return commands;
};
Array.prototype.send = function (hosts: string[]): string[] {
  // Containers methods
  const commands: string[] = [];
  if (this.length != 0) {
    for (const e of this) {
      commands.push(...e.send(hosts));
    }
  }
  return commands;
};

export type Port = {
  out: number;
  in: number;
};

export interface NetworkParams {
  id?: string;
  name: string;
  subnet?: string;
  driver?: string;
}
export class Network implements NetworkParams {
  id?: string;
  name: string;
  subnet?: string;
  driver?: string;
  constructor(params: NetworkParams) {
    this.name = params.name;
  }
  create(): string[] {
    const cmds: string[] = [];
    let str = `docker network create \ `;
    str += `--subnet=${this.subnet}`;
    if (this.driver) {
      str += `--driver ${this.driver} \  `;
    }
    str += `${this.name}`;
    cmds.push(str);
    return cmds;
  }
}

export interface VolumeParams {
  id?: string;
  name: string;
}
export class Volume implements VolumeParams {
  id?: string;
  name: string;
  constructor(params: VolumeParams) {
    this.name = params.name;
  }
  create(): string[] {
    // run new container
    const cmds: string[] = [];
    let str = `docker volume create \ `;
    str += `--name ${this.name}`;
    cmds.push(str);
    return cmds;
  }
}

export interface ImageParams {
  id?: string;
  file?: string;
  name: string;
}
export class Image implements ImageParams {
  id?: string;
  file?: string;
  name: string;
  constructor(params: ImageParams) {
    this.name = params.name;
  }
  create(): string[] {
    const cmds: string[] = [];
    let str = `docker build \ `;
    str += `--tag ${this.name}`;
    if (this.file) {
      str += `--file ${this.file} \ `;
    } else {
      str += ` . \ `;
    }
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

export interface ContainerParams {
  id?: string;
  ip?: string;
  network?: Pick<NetworkParams, "name">;
  name: string;
  ports?: Port[];
  image: Pick<ImageParams, "name">;
}
export class Container implements ContainerParams {
  id?: string;
  ip?: string;
  network?: Pick<NetworkParams, "name">;
  name: string;
  ports?: Port[];
  image: Pick<ImageParams, "name">;
  constructor(params: ContainerParams) {
    this.name = params.name;
    this.image = params.image;
    this.network = params.network;
    this.ports = params.ports;
  }
  // Create container and Run it
  create(): string[] {
    let hostNetwork: string = "127.0.0.1";
    const cmds: string[] = [];
    let str = `docker run \ `;
    str += `--detach \ `;
    if (!!this.ports) {
      for (const port of this.ports) {
        str += `--publish ${hostNetwork}:${port.out}:${port.in} \ `;
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
    let str = `docker stop ${this.name}` + " && " + `docker rm ${this.name}`;
    cmds.push(str);
    return cmds;
  }
}

export interface DockerParams {
  id?: string;
  networks?: NetworkParams[];
  containers?: ContainerParams[];
  volumes?: VolumeParams[];
  images?: ImageParams[];
}
export class Docker {
  id?: string;
  networks: Network[] = [];
  containers: Container[] = [];
  images: Image[] = [];
  volumes: Volume[] = [];
  constructor(params: DockerParams) {
    if (!!params.images) {
      for (const e of params.images) {
        this.images.push(new Image(e));
      }
    }
    if (!!params.containers) {
      for (const e of params.containers) {
        this.containers.push(new Container(e));
      }
    }
    if (!!params.volumes) {
      for (const e of params.volumes) {
        this.volumes.push(new Volume(e));
      }
    }
    if (!!params.networks) {
      for (const e of params.networks) {
        this.networks.push(new Network(e));
      }
    }
  }
}
