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

declare global {
  export interface Array<T> {
    dedup<T>(key?: string): Array<T>;
  }
}
Array.prototype.dedup = function (key?: string) {
  return uniqBy(this, !!key ? key : "name");
};
