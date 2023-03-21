const exec = async (cmd: string) => {
  const array_str = cmd.split(" ");

  const process = new Deno.Command(array_str.shift() as string, {
    args: array_str,
  });

  const { code, stdout, stderr } = await process.output();
  const res = new TextDecoder().decode(stdout);
  const err = new TextDecoder().decode(stderr);

  if (code) {
    return res;
  } else {
    return err;
  }
};

export { exec };
