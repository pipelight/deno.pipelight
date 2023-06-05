export interface MountVolumeParams {
  name: string;
  // path inside container
  path: string;
}
export interface MountVolumeAutoParams {
  suffix: string;
  // path inside container
  path: string;
}

export interface VolumeSave {
  host: {
    path: string;
  };
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
      host: {
        path: "~/.docker/volumes",
      },
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
    cmds.push(`mkdir -p ${this.save.host.path}`);
    let str = `
      docker run \
        --rm \
        --volume ${this.name}:/from \
        --volume ${this.save.host.path}:/to \
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
        --volume ${this.save.host.path}:/from\
        --volume ${this.name}:/to \
        archlinux \
        tar -xf /from/${this.name}.tar.xz \
        --directory="/to"
    `;
    cmds.push(str);
    return cmds;
  }
}
