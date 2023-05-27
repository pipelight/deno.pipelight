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
  id?: string;
  name: string;
  constructor(params: VolumeParams) {
    this.name = params.name;
  }
  create(): string[] {
    // run new container
    const cmds: string[] = [];
    let str = `docker volume create \ `;
    str += `--name ${this.name}`;
    cmds.push(str);
    return cmds;
  }
}
