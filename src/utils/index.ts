import { Container, Volume } from "../helpers/docker/mod.ts";
import type { ImageParams } from "../helpers/docker/mod.ts";
export * from "./global.ts";

export const get_subnet = (ip: string): string => {
  const splitted = ip.split(".");
  const base = splitted.slice(0, splitted.length - 1).join(".");
  const subnet = base + ".0/24";
  return subnet;
};
export const uniqBy = <T>(a: Array<T>, key: string): Array<T> => {
  let seen = new Set();
  return a.filter((item) => {
    let k: any = item[key as keyof T];
    return seen.has(k) ? false : seen.add(k);
  });
};

// Check if image exists on dockerhub
export const exists = async (image: ImageParams): Promise<boolean> => {
  // const [name, tag] = image.name.split(":");
  // const res = await exec(`docker manifest inspect ${image.name}`);
  // console.log(res);
  return false;
};
