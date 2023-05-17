import { ssh } from "../helpers.ts";
declare global {
  interface Array<T> {
    remove(): string[];
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

interface Port {
  out: number;
  in: number;
}

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
    let str = `docker network create \n`;
    str += `--subnet=${this.subnet}`;
    if (this.driver) {
      str += `--driver ${this.driver} \n `;
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
    let str = `docker volume create \n`;
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
  build(): string[] {
    const cmds: string[] = [];
    let str = `docker build \n`;
    if (this.file) {
      str += `--file ${this.file} \n`;
    }
    str += `--tag ${this.name}`;
    cmds.push(str);
    return cmds;
  }
  send(host: string): string[] {
    const cmds: string[] = [];
    let str = `docker save ${this.name}`;
    str += " | " + ssh([host], ["docker load"]);
    cmds.push(str);
    return cmds;
  }
}

export interface ContainerParams {
  id?: string;
  ip?: string;
  network?: string;
  name: string;
  ports?: Port[];
  image: ImageParams;
}
export class Container implements ContainerParams {
  id?: string;
  ip?: string;
  network?: string = "127.0.0.1";
  name: string;
  ports?: Port[];
  image: ImageParams;
  constructor(params: ContainerParams) {
    this.name = params.name;
    this.image = params.image;
  }
  // Delete container
  remove(): string[] {
    const cmds: string[] = [];
    let str = `docker stop ${this.name}` + " && " + `docker rm ${this.name}`;
    cmds.push(str);
    return cmds;
  }
  // Create container and Run it
  create(): string[] {
    const cmds: string[] = [];
    let str = `docker run \n `;
    str += `--detach \n `;
    str += `--name ${this.name} \n `;
    if (this.ports) {
      for (const port of this.ports)
        str += `--publish ${this.network}:${port.out}:${port.in}\n`;
    }
    cmds.push(str);
    return cmds;
  }
}

export interface DockerParams {
  id?: string;
  networks?: NetworkParams[];
  containers?: ContainerParams[];
  volumes?: VolumeParams[];
}
export class Docker {
  id?: string;
  networks: Network[] = [];
  containers: Array<Container> = [];
  volumes: Volume[] = [];
  constructor(params: DockerParams) {
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
  ensure(): string[] {
    const commands: string[] = [];
    if (this.volumes.length != 0) {
      for (const e of this.volumes) {
        commands.push(...e.create());
      }
    }
    if (this.networks.length != 0) {
      for (let e of this.networks) {
        commands.push(...e.create());
      }
    }
    return commands;
  }
  create(): string[] {
    const commands: string[] = [];
    if (this.containers.length != 0) {
      for (const e of this.containers) {
        commands.push(...e.create());
      }
    }
    return commands;
  }
}
