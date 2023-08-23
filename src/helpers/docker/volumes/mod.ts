import { Container } from "../containers/mod.ts";

// Args to save volumes data to host
export interface VolumeSave {
  source: string;
  compressed?: boolean;
}

// Args for volume linking to containers
export interface MountVolumeParams {
  name: string;
  target: string; // path inside container
}
export interface MountVolumeAutoParams {
  suffix: string;
  source?: string; // path in host
  target: string; // path inside container
}

// Args for volume creation
export interface VolumeParams {
  name: string;
  source?: string; // path in host
}

export class Volume {
  name: string;
  source?: string;
  save: VolumeSave; // backup params
  constructor(params: VolumeParams) {
    this.name = params.name;
    this.save = {
      source: "~/.docker/volumes",
      compressed: true,
    };
    this.source = params.source;
  }
  create(): string[] {
    // create or update volume
    const cmds: string[] = [];
    let str = `docker volume create \ `;
    if (!!this.source) {
      str += `-d local-persist \ -o mountpoint=${this.source} \ `;
    }
    str += `--name ${this.name}`;
    cmds.push(str);
    return cmds;
  }
  remove(): string[] {
    // remove volume
    const cmds: string[] = [];
    let str = `docker volume rm ${this.name}`;
    cmds.push(str);
    return cmds;
  }
  backup(): string[] {
    // backup volume to host archive
    const cmds: string[] = [];
    cmds.push(`mkdir -p ${this.save.source}`);
    let str = `
      docker run \
        --rm \
        --volume ${this.name}:/from \
        --volume ${this.save.source}:/to \
        archlinux \
        tar -cJf /to/${this.name}.tar.xz \
        --directory="/from" .
    `;
    cmds.push(str);
    return cmds;
  }
  restore(): string[] {
    // restore volume from host archive
    const cmds: string[] = [];
    let str = `
      docker run \
        --rm \
        --volume ${this.save.source}:/from\
        --volume ${this.name}:/to \
        archlinux \
        tar -xf /from/${this.name}.tar.xz \
        --directory="/to"
    `;
    cmds.push(str);
    return cmds;
  }
}

// Volumes
const get_volume = (
  array: Volume[],
  suffix: string,
  container_suffix: string
): Volume | undefined => {
  let full_name: string;
  if (!!array.ctx) {
    full_name = `${array.ctx.version}_${container_suffix}_${array.ctx.dns}__${suffix}`;
  } else {
    full_name = suffix;
  }
  return array.find((e) => e.name == full_name);
};
