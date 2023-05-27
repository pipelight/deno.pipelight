import {
  MountVolumeAutoParams,
  MountVolumeParams,
  ImageAutoParams,
  ImageParams,
  MountNetworkAutoParams,
  MountNetworkParams,
  Port,
} from "./index.ts";

export interface ContainerAutoParams {
  suffix: string;
  image: ImageAutoParams;
  volumes?: Array<MountVolumeAutoParams | MountVolumeParams>;
  networks?: MountNetworkAutoParams[];
  ports?: Port[];
}
export interface ContainerParams {
  name: string;
  image: Pick<ImageParams, "name">;
  volumes?: MountVolumeParams[];
  networks?: MountNetworkParams[];
  ports?: Port[];
}
export class Container implements ContainerParams {
  networks?: MountNetworkParams[];
  volumes?: MountVolumeParams[];
  name: string;
  ports?: Port[];
  image: Pick<ImageParams, "name">;
  constructor(params: ContainerParams) {
    this.name = params.name;
    this.image = params.image;
    this.volumes = params.volumes;
    this.networks = params.networks;
    this.ports = params.ports;
  }
  // Create container and Run it
  create(): string[] {
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
      for (const port of this.ports) {
        str += `--publish ${host.network.private}:${port.out}:${port.in} \ `;
      }
    }
    if (!!this.networks) {
      for (const network of this.networks) {
        str += `--network ${network.name} \ `;
      }
    }
    if (!!this.volumes) {
      for (const volume of this.volumes) {
        str += `--volume ${volume.name}:${volume.path.inside} \ `;
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