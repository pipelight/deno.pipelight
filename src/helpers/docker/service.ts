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
declare global {
  export interface Map<K, V> {
    remove(): string[];
    create(): string[];
  }
}
Map.prototype.remove = function (): string[] {
  // Containers methods
  const commands: string[] = [];
  const array = Array.from(this, ([key, value]) => value);
  if (array.length != 0) {
    for (const e of array) {
      commands.push(...e.remove());
    }
  }
  return commands;
};
Map.prototype.create = function (): string[] {
  // Containers methods
  const commands: string[] = [];
  const array = Array.from(this, ([key, value]) => value);
  if (array.length != 0) {
    for (const e of array) {
      commands.push(...e.create());
    }
  }
  return commands;
};

export interface Globals {
  version: string;
  // version: production
  dns: string;
  // dns: pipelight.dev
}

export interface ServiceParams {
  globals: Globals;
  containers: ContainerAutoParams[];
}
export class Service {
  docker: Docker;
  constructor(params: ServiceParams) {
    this.docker = new Docker(params);
  }
  update(): string[] {
    const docker = this.docker;
    const cmds = [...docker.images.create()];
    return cmds;
  }
  upgrade(): string[] {
    const docker = this.docker;
    const cmds = [
      // update volumes
      ...docker.volumes.create(),
      // update networks
      ...docker.networks.remove(),
      ...docker.networks.create(),
      // update containers
      ...docker.containers.remove(),
      ...docker.containers.create(),
    ];
    return cmds;
  }
}

export interface DockerParams {
  images?: ImageParams[];
  volumes?: VolumeParams[];
  networks?: NetworkParams[];
  containers?: ContainerParams[];
}
export class Docker {
  networks: Network[] = [];
  containers: Map<String, Container> = new Map();
  images: Image[] = [];
  volumes: Volume[] = [];
  constructor(params: DockerParams | ServiceParams) {
    if ("globals" in params) {
      this.from_service_params(params);
    } else {
      this.from_docker_params(params);
    }
    this.dedup();
  }
  from_docker_params(params: DockerParams) {
    if (!!params.images) {
      for (const e of params.images) {
        this.images.push(new Image(e));
      }
    }
    if (!!params.containers) {
      for (const e of params.containers) {
        this.containers.set(e.name, new Container(e));
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
    const { version, dns } = params.globals;
    const docker: DockerParams = {
      images: [],
      volumes: [],
      networks: [],
      containers: [],
    };
    for (const e of params.containers) {
      // Image definition
      if (!!e.image) {
        docker.images?.push({
          name: `${dns}/${e.suffix}:${version}`,
          file: `.docker/Dockerfile.${e.suffix}`,
        });
      }
      // Container definition
      const container: ContainerParams = {
        name: `${version}.${e.suffix}.${dns}`,
        image: { name: `${dns}/${e.suffix}:${version}` },
        ports: e.ports,
        envs: e.envs,
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
            name = `${version}_${dns}__${network.suffix}`;
          }
          // Set subnet based on ip
          if (!!network.ip) {
            const net: NetworkParams = {
              name: name,
              subnet: get_subnet(network.ip),
            };
            docker.networks?.push(net);
            // Link network definition to container
            container.networks.push({
              name,
              ip: network.ip,
            });
          } else {
            const net: NetworkParams = {
              name: name,
            };
            docker.networks?.push(net);
            // Link network definition to container
            container.networks.push({
              name,
            });
          }
        }
      }
      docker.containers?.push(container);
    }
    this.from_docker_params(docker);
  }
  dedup() {
    for (const [key, value] of Object.entries(this)) {
      const uniq = value.dedup();
      this[key as keyof Docker] = uniq;
    }
  }
}
