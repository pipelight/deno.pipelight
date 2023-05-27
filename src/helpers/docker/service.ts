import {
  MountVolumeAutoParams,
  MountVolumeParams,
  VolumeParams,
  Volume,
  ImageAutoParams,
  ImageParams,
  Image,
  MountNetworkAutoParams,
  MountNetworkParams,
  NetworkParams,
  Network,
  Port,
  Container,
  ContainerParams,
  ContainerAutoParams,
} from "./index.ts";

import { get_subnet } from "../../utils/index.ts";

declare global {
  export interface Array<T> {
    up(): string[];
    down(): string[];
  }
}
Array.prototype.up = function (): string[] {
  // Containers methods
  const commands: string[] = [];
  if (this.length != 0) {
    for (const e of this) {
      commands.push(...e.up());
    }
  }
  return commands;
};

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

export interface Globals {
  // version: production
  version: string;
  // host: linode
  host: string;
  // service: api
  // service: string;
  // dns: pipelight.dev
  dns: string;
}

export interface ServiceParams {
  globals: Globals;
  containers: ContainerAutoParams[];
}
export interface DockerParams {
  images?: ImageParams[];
  volumes?: VolumeParams[];
  networks?: NetworkParams[];
  containers?: ContainerParams[];
}
export class Docker {
  networks: Network[] = [];
  containers: Container[] = [];
  images: Image[] = [];
  volumes: Volume[] = [];
  constructor(params: DockerParams | ServiceParams) {
    if ("globals" in params) {
      this.from_service_params(params);
    } else {
      this.from_docker_params(params);
    }
  }
  from_docker_params(params: DockerParams) {
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
  from_service_params(params: ServiceParams) {
    const { version, host, dns } = params.globals;
    let docker: DockerParams = {};

    for (const e of params.containers) {
      // Image definition
      docker.images?.push({
        name: `${dns}/${e.suffix}:${version}`,
        file: `.docker/Dockrefile.${e.suffix}`,
      });
      // Container definition
      const container: ContainerParams = {
        name: `${version}.${e.suffix}.${dns}`,
        image: { name: `${dns}/${e.suffix}:${version}` },
        ports: e.ports,
      };
      if (!!e.volumes) {
        container.volumes = [];
        for (const volume of e.volumes) {
          // Volume definition
          let name: string;
          if ("name" in volume) {
            name = `${volume.name}`;
          } else {
            name = `${version}_${e.suffix}_${dns}__${volume.suffix}`;
          }
          docker.volumes?.push({
            name: name,
          });
          // Link volume definition to container
          container.volumes.push({
            name: name,
            path: volume.path,
          });
        }
      }
      if (!!e.networks) {
        container.networks = [];
        for (const network of e.networks) {
          // Network definition
          let name: string;
          if ("name" in network) {
            name = `${network.name}`;
          } else {
            name = `${version}_${e.suffix}_${dns}__${network.suffix}`;
          }
          // Set subnet based on ip
          if (!!network.ip) {
            const net: NetworkParams = {
              name: name,
              subnet: get_subnet(network.ip),
            };
            docker.networks?.push(net);
            // Link network definition to container
            container.networks.push(net);
          } else {
            const net: NetworkParams = {
              name: name,
            };
            docker.networks?.push(net);
            // Link network definition to container
            container.networks.push(net);
          }
        }
      }
      docker.containers?.push(container);
    }
    this.from_docker_params(docker);
  }
  up(): string[] {
    const cmds = [
      ...this.images.create(),
      ...this.volumes.create(),
      ...this.networks.create(),
      ...this.containers.create(),
    ];
    return cmds;
  }
  down(): string[] {
    const cmds = [
      ...this.images.remove(),
      ...this.volumes.remove(),
      ...this.networks.remove(),
      ...this.containers.remove(),
    ];
    return cmds;
  }
}
