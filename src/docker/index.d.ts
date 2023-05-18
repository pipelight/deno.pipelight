declare global {
    interface Array<T> {
        remove(): string[];
        create(): string[];
        send(remote: string[]): string[];
    }
}
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
    constructor(params: NetworkParams);
    create(): string[];
}
export interface VolumeParams {
    id?: string;
    name: string;
}
export declare class Volume implements VolumeParams {
    id?: string;
    name: string;
    constructor(params: VolumeParams);
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
    constructor(params: ImageParams);
    create(): string[];
    remove(): string[];
    send(hosts: string[]): string[];
}
export interface ContainerParams {
    id?: string;
    ip?: string;
    network?: string;
    name: string;
    ports?: Port[];
    image: Pick<ImageParams, "name">;
}
export declare class Container implements ContainerParams {
    id?: string;
    ip?: string;
    network?: string;
    name: string;
    ports?: Port[];
    image: ImageParams;
    constructor(params: ContainerParams);
    create(): string[];
    remove(): string[];
}
export interface DockerParams {
    id?: string;
    networks?: NetworkParams[];
    containers?: ContainerParams[];
    volumes?: VolumeParams[];
    images?: ImageParams[];
}
export declare class Docker {
    id?: string;
    networks: Network[];
    containers: Container[];
    images: Image[];
    volumes: Volume[];
    constructor(params: DockerParams);
}
export {};
