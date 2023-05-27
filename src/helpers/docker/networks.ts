export type Port = {
  out: number;
  in: number;
};
export interface MountNetworkParams {
  name: string;
  ip?: string;
}
export interface MountNetworkAutoParams {
  suffix: string;
  ip?: string;
}

export interface NetworkParams {
  name: string;
  subnet?: string;
  driver?: string;
}
export class Network implements NetworkParams {
  name: string;
  subnet?: string;
  driver?: string;
  constructor(params: NetworkParams) {
    this.name = params.name;
    this.subnet = params.subnet;
    this.driver = params.driver;
  }
  create(): string[] {
    const cmds: string[] = [];
    let str = `docker network create \ `;
    if (!!this.subnet) {
      str += `--subnet=${this.subnet}`;
    }
    if (!!this.driver) {
      str += `--driver ${this.driver} \  `;
    }
    str += `${this.name}`;
    cmds.push(str);
    return cmds;
  }
  remove(): string[] {
    const cmds: string[] = [];
    let str = `docker network rm ${this.name}\ `;
    cmds.push(str);
    return cmds;
  }
}
