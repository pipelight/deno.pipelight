export interface MountVolumeParams {
  name: string;
  target: string;
}
export interface MountVolumeAutoParams {
  suffix: string;
  target: string;
}
export interface BindMountParams {
  // path in host
  source: string;
  // path inside container
  target: string;
}

export interface VolumeSave {
  source: string;
  compressed?: boolean;
}

export interface VolumeParams {
  name: string;
}
export class Volume implements VolumeParams {
  name: string;
  // backup params
  save: VolumeSave;
  constructor(params: VolumeParams) {
    this.name = params.name;
    this.save = {
      source: "~/.docker/volumes",
      compressed: true,
    };
  }
  create(): string[] {
    // create or update volume
    const cmds: string[] = [];
    let str = `docker volume create \ `;
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
