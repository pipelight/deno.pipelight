import {
  MountVolumeAutoParams,
  MountVolumeParams,
  BindMountParams,
  ImageAutoParams,
  ImageParams,
  MountNetworkAutoParams,
  MountNetworkParams,
  PortParams,
  Port,
} from "./mod.ts";

export interface DockerArgs {
  [key: string]: string;
}
export interface ContainerAutoParams {
  suffix: string;
  image: ImageAutoParams;
  volumes?: Array<MountVolumeAutoParams | MountVolumeParams>;
  networks?: Array<MountNetworkAutoParams | MountNetworkParams>;
  ports?: PortParams[];
  envs?: string[];
}
export interface ContainerParams {
  name: string;
  image: Pick<ImageParams, "name">;
  networks?: MountNetworkParams[];
  volumes?: Array<MountVolumeParams | BindMountParams>;
  ports?: PortParams[];
  envs?: string[];
}
export class Container implements ContainerParams {
  name: string;
  image: Pick<ImageParams, "name">;
  networks?: MountNetworkParams[];
  volumes?: Array<MountVolumeParams | BindMountParams>;
  ports?: PortParams[];
  envs?: string[];
  constructor(params: ContainerParams) {
    this.name = params.name;
    this.image = params.image;
    this.volumes = params.volumes;
    this.networks = params.networks;
    this.ports = params.ports;
  }
  // Create container and Run it
  create(args?: DockerArgs): string[] {
    let host = {
      network: {
        public: "0.0.0.0",
        private: "127.0.0.1",
      },
    };
    const cmds: string[] = [];
    let str = `docker run \ `;
    str += `--detach \ `;
    if (!!this.ports) {
      for (const port_params of this.ports) {
        const port = new Port(port_params);
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
        if ("source" in volume) {
          str += `--volume ${volume.source}:${volume.target} \ `;
        } else {
          str += `--volume ${volume.name}:${volume.target} \ `;
        }
      }
    }
    if (!!this.envs) {
      for (const env of this.envs) {
        str += `--env ${env} \ `;
      }
    }
    if (!!args) {
    }

    str += `--name ${this.name} \ `;
    str += this.image.name;
    cmds.push(str);
    return cmds;
  }
  // Delete container
  remove(): string[] {
    const cmds: string[] = [];
    let str =
      `docker container stop ${this.name}` +
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
  exec(inputs: string[]): string[] {
    const cmds: string[] = [];
    for (const input of inputs) {
      let str = `docker container exec ${this.name} \ `;
      str += input;
      cmds.push(str);
    }
    return cmds;
  }
}
