// @ts-ignore
import { Pipeline, Step } from "../mod.ts";

interface Port {
  out: number;
  in: number;
}

export class Network {
  id?: string;
  name: string;
  subnet?: string;
  constructor(name: string) {
    this.name = name;
  }
}

interface VolumeParams {
  id?: string;
  name: string;
  subnet?: string;
}

export class Volume implements VolumeParams {
  id?: string;
  name: string;
  subnet?: string;
  constructor(name: string) {
    this.name = name;
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

interface ImageParams {
  id?: string;
  file?: string;
  name: string;
}

export class Image implements ImageParams {
  id?: string;
  file?: string;
  name: string;
  constructor(name: string) {
    this.name = name;
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
}

interface ContainerParams {
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
    let str = `docker stop ${this.name}` + " && " + `docker stop ${this.name}`;
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

interface DockerParams {
  id?: string;
  networks?: Network[];
  containers: ContainerParams[];
  volumes?: Volume[];
}

export class Docker {
  id?: string;
  networks: Network[] = [];
  containers: Container[] = [];
  volumes: Volume[] = [];
  constructor(params: DockerParams) {
    for (const e of params.containers) {
      this.containers.push(new Container(e));
    }
    if (params.volumes) params.volumes = this.volumes;
    if (params.networks) params.networks = this.networks;
  }
  to_commands(): string[] {
    const commands = [];

    if (this.containers.length != 0) {
      for (const e of this.containers) {
        commands.push(...e.remove(), ...e.create());
      }
    }
    if (this.volumes.length != 0) {
      for (const e of this.volumes) {
        commands.push(...e.create());
      }
    }
    if (this.networks.length != 0) {
      for (let e of this.networks) {
        commands.push(
          `docker network create \
          --driver bridge ${e.name} \
          --subnet=${e.subnet}`
        );
      }
    }
    if (this.volumes.length != 0) {
      for (let e of this.volumes) {
        commands.push(
          `docker volume  \
          --network ${e.name} .`
        );
      }
    }
    return commands;
  }
}

// example
export const pipeline = (name: string, fn: () => Step[]): Pipeline => {
  const steps = fn();
  const p: Pipeline = {
    name,
    steps,
  };
  return p;
};
export const step = (name: string, fn: () => string[]): Step => {
  const commands = fn();
  const s = {
    name,
    commands,
  };
  return s;
};

// const docker = new Docker();
// const container = new Container({
//   volume: "",
// docker.container.push(container);
