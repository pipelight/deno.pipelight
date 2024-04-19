import $ from "https://deno.land/x/dax/mod.ts";

/*
 * Append or upsert the Caddyfile configuration to the actual
 * caddy configuration.
 */

let port = 2019;

const make_config = async (service_name: string) => {
  // Get the Caddyfile as a json for further manipulations
  const fragment = await $`caddy adapt 2> /dev/null`.json();
  const configuration =
    await $`curl http://localhost:${port}/config/ 2> /dev/null`
      .json();

  for (const [key, value] of Object.entries(fragment.apps.http.servers)) {
    // Give server entries a unique name
    const srv = key + "." + service_name;

    // Fuse with the actual configuration
    configuration.apps.http.servers[srv] = value;
  }

  console.debug(Deno.inspect(configuration, { depth: 50 }));

  const cmd = `curl localhost:${port}/load \
    --header "Content-Type:application/json" \
    --data ${JSON.stringify(JSON.stringify(configuration))}`;

  return cmd;
};

export const caddy = {
  port,
  make_config,
};
