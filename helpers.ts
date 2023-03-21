const exec = async (cmd: string) => {
  const process = new Deno.Command("sh", {
    args: ["-c", cmd],
  });
  const { code, stdout, stderr } = await process.output();
  const res = new TextDecoder().decode(stdout).replace(/\s+$/, "");
  const err = new TextDecoder().decode(stderr).replace(/\s+$/, "");
  if (!code) {
    return res;
  } else {
    return err;
  }
};
export { exec };
