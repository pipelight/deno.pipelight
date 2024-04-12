// When multiple ssh session are requested by pipelight, it goes to fast for the tcp connection to keep up.
// It needs to be killed before requesting for another  -> "keepAlive = No"
const ssh_wrapper = (host: string, cmd: string): string => {
  const suffix = "ssh -o TCPKeepAlive=no -C";
  return `${suffix} ${host} \\
    '${cmd}'`;
};
export const ssh = (host: string, cmds: () => string[]): string[] => {
  const commands: string[] = [];
  for (const command of cmds()) {
    commands.push(ssh_wrapper(host, command));
  }
  return commands;
};
