interface Port {
    out: number;
    in: number;
}
export interface NetworkParams {
    id?: string;
    name: string;
    subnet?: string;
    driver?: string;
}
export declare class Network implements NetworkParams {
    id?: string;
    name: string;
    subnet?: string;
    driver?: string;
    constructor(name: string);
    create(): string[];
}
export interface VolumeParams {
    id?: string;
    name: string;
}
export declare class Volume implements VolumeParams {
    id?: string;
    name: string;
    constructor(name: string);
    create(): string[];
}
export interface ImageParams {
    id?: string;
    file?: string;
    name: string;
}
export declare class Image implements ImageParams {
    id?: string;
    file?: string;
    name: string;
    constructor(name: string);
    build(): string[];
    send(host: string): string[];
}
export interface ContainerParams {
    id?: string;
    ip?: string;
    network?: string;
    name: string;
    ports?: Port[];
    image: ImageParams;
}
export declare class Container implements ContainerParams {
    id?: string;
    ip?: string;
    network?: string;
    name: string;
    ports?: Port[];
    image: ImageParams;
    constructor(params: ContainerParams);
    remove(): string[];
    create(): string[];
}
export interface DockerParams {
    id?: string;
    networks?: NetworkParams[];
    containers: ContainerParams[];
    volumes?: VolumeParams[];
}
export declare class Docker {
    id?: string;
    networks: Network[];
    containers: Container[];
    volumes: Volume[];
    constructor(params: DockerParams);
    remove(): string[];
    ensure(): string[];
    create(): string[];
}
export {};
