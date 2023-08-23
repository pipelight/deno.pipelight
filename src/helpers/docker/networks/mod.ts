export const get_subnet = (ip: string): string => {
  const splitted = ip.split(".");
  const base = splitted.slice(0, splitted.length - 1).join(".");
  const subnet = base + ".0/24";
  return subnet;
};

export interface PortParams {
  in: number;
  out: number;
  private?: boolean;
}
export class Port {
  in: number;
  out: number;
  ip?: string;
  constructor(params: PortParams) {
    this.in = params.in;
    this.out = params.out;
    if (params.private == false) {
      this.ip = "0.0.0.0";
    } else {
      this.ip = "127.0.0.1";
    }
  }
}
export interface MountNetworkParams {
  name: string;
  ip?: string;
  args?: Record<string, string>[];
}
export interface MountNetworkAutoParams {
  suffix: string;
  ip?: string;
  args?: Record<string, string>[];
}

export interface NetworkParams {
  name: string;
  subnet?: string;
  driver?: string;
  args?: Record<string, string>[];
}
export class Network implements NetworkParams {
  name: string;
  subnet?: string;
  driver?: string;
  args?: Record<string, string>[];
  constructor(params: NetworkParams) {
    this.name = params.name;
    this.subnet = params.subnet;
    this.driver = params.driver;
    // handcraft
    this.args = params.args;
  }
  create(): string[] {
    const cmds: string[] = [];
    let str = `docker network create \ `;
    if (!!this.subnet) {
      str += `--subnet=${this.subnet} \ `;
    }
    if (!!this.driver) {
      str += `--driver ${this.driver} \  `;
    }
    if (!!this.args) {
      for (const [key, value] of Object.entries(this.args)) {
        str += `--${key} ${value} \ `;
      }
    }
    str += `${this.name}`;
    cmds.push(str);
    return cmds;
  }
  remove(): string[] {
    const cmds: string[] = [];
    let str = `docker network rm ${this.name}`;
    cmds.push(str);
    return cmds;
  }
}
