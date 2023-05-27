export const get_subnet = (ip: string): string => {
  const splitted = ip.split(".");
  const base = splitted.slice(0, splitted.length - 1).join(".");
  const subnet = base + ".0/24";
  return subnet;
};
export const uniqBy = (a: Array<T>, key: string): Array<T> => {
  let seen = new Set();
  return a.filter((item) => {
    let k = item[key];
    return seen.has(k) ? false : seen.add(k);
  });
};

declare global {
  export interface Array<T> {
    dedup(): string[];
  }
}
Array.prototype.dedup = function () {
  return uniqBy(this, "name");
};
