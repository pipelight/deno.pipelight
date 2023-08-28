const novops_wrapper = (cmd: string): string => {
  const suffix = "novops run --";
  return `${suffix} ${cmd}`;
};
export const novops = (cmds: () => string[]): string[] => {
  const commands: string[] = [];
  for (const command of cmds()) {
    commands.push(novops_wrapper(command));
  }
  return commands;
};
