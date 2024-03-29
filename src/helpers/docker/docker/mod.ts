import {
  MountVolumeAutoParams,
  MountVolumeParams,
  VolumeParams,
  Volume,
} from "../volumes/mod.ts";
import { ImageAutoParams, ImageParams, Image } from "../images/mod.ts";
import {
  MountNetworkAutoParams,
  MountNetworkParams,
  NetworkParams,
  Network,
  Port,
} from "../networks/mod.ts";
import { get_subnet } from "../networks/mod.ts";
import {
  Container,
  ContainerParams,
  ContainerAutoParams,
} from "../containers/mod.ts";
import { Globals } from "../globals.ts";

export interface DockerAutoParams {
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
  globals?: Globals;
  constructor(params: DockerParams | DockerAutoParams) {
    if ("globals" in params) {
      this.hydrate(this.convert(params));
      this.globals = params.globals;
      // add ctx to arrays
      this.containers.ctx = params.globals;
      this.images.ctx = params.globals;
      this.volumes.ctx = params.globals;
      this.networks.ctx = params.globals;
    } else {
      this.hydrate(params);
    }
  }
  //Private
  hydrate(params: DockerParams) {
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
    this.dedup();
  }
  //Private
  convert(params: DockerAutoParams) {
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
          name: `${dns}/${e.image.suffix}:${version}`,
          file: `.docker/Dockerfile.${e.image.suffix}`,
        });
      } else {
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
        globals: params.globals,
      };
      if (!!e.volumes) {
        container.volumes = [];
        for (const volume of e.volumes) {
          // Volume definition
          let name: string;
          let source: string;
          if ("name" in volume) {
            name = `${volume.name}`;
          } else {
            name = `${version}_${e.suffix}_${dns}__${volume.suffix}`;
          }
          if ("source" in volume) {
            if (!!volume.source) {
              source = volume.source!;
              docker.volumes?.push({
                name: name,
                source: source,
              });
            }
          } else {
            docker.volumes?.push({
              name: name,
            });
          }

          // Link volume definition to container
          container.volumes.push({
            name: name,
            target: volume.target,
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
    return docker;
  }
  //Private
  dedup() {
    type ValueOf<T> = T[keyof T];
    for (const [key, value] of Object.entries(this)) {
      if (!!value && Array.isArray(value)) {
        const uniq = value.dedup();
        // @ts-ignore
        this[key as keyof Docker] = uniq as ValueOf<Docker>;
      }
    }
  }
}
