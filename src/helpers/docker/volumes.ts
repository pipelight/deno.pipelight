export interface MountVolumeParams {
  name: string;
  path: {
    // Inside container path
    inside: string;
  };
}
export interface MountVolumeAutoParams {
  suffix: string;
  path: {
    // Inside container path
    inside: string;
  };
}

export interface VolumeParams {
  name: string;
}
export class Volume implements VolumeParams {
  name: string;
  constructor(params: VolumeParams) {
    this.name = params.name;
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
}
