export class Network {
    id;
    name;
    subnet;
    constructor(name) {
        this.name = name;
    }
}
export class Volume {
    id;
    name;
    subnet;
    constructor(name) {
        this.name = name;
    }
    create() {
        // run new container
        const cmds = [];
        let str = `docker volume create \n`;
        str += `--name ${this.name}`;
        cmds.push(str);
        return cmds;
    }
}
export class Image {
    id;
    file;
    name;
    constructor(name) {
        this.name = name;
    }
    build() {
        const cmds = [];
        let str = `docker build \n`;
        if (this.file) {
            str += `--file ${this.file} \n`;
        }
        str += `--tag ${this.name}`;
        cmds.push(str);
        return cmds;
    }
}
export class Container {
    id;
    ip;
    network = "127.0.0.1";
    name;
    ports;
    image;
    constructor(params) {
        this.name = params.name;
        this.image = params.image;
    }
    // Delete container
    remove() {
        const cmds = [];
        let str = `docker stop ${this.name}` + " && " + `docker stop ${this.name}`;
        cmds.push(str);
        return cmds;
    }
    // Create container and Run it
    create() {
        const cmds = [];
        let str = `docker run \n `;
        str += `--detach \n `;
        str += `--name ${this.name} \n `;
        if (this.ports) {
            for (const port of this.ports)
                str += `--publish ${this.network}:${port.out}:${port.in}\n`;
        }
        cmds.push(str);
        return cmds;
    }
}
export class Docker {
    id;
    networks = [];
    containers = [];
    volumes = [];
    constructor(params) {
        for (const e of params.containers) {
            this.containers.push(new Container(e));
        }
        if (params.volumes)
            params.volumes = this.volumes;
        if (params.networks)
            params.networks = this.networks;
    }
    to_commands() {
        const commands = [];
        if (this.containers.length != 0) {
            for (const e of this.containers) {
                commands.push(...e.remove(), ...e.create());
            }
        }
        if (this.volumes.length != 0) {
            for (const e of this.volumes) {
                commands.push(...e.create());
            }
        }
        if (this.networks.length != 0) {
            for (let e of this.networks) {
                commands.push(`docker network create \
          --driver bridge ${e.name} \
          --subnet=${e.subnet}`);
            }
        }
        if (this.volumes.length != 0) {
            for (let e of this.volumes) {
                commands.push(`docker volume  \
          --network ${e.name} .`);
            }
        }
        return commands;
    }
}
// example
export const pipeline = (name, fn) => {
    const steps = fn();
    const p = {
        name,
        steps,
    };
    return p;
};
export const step = (name, fn) => {
    const commands = fn();
    const s = {
        name,
        commands,
    };
    return s;
};
// const docker = new Docker();
// const container = new Container({
//   volume: "",
// docker.container.push(container);
