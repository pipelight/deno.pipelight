import type { Globals, Port } from "../../docker/mod.ts";
import { Container } from "../../docker/mod.ts";
// Nginx unti helpers

/**
Convert the given configuration object into a JSON string
And send it to nginx-unit unix socket with cURL.
*/

const unit_default_url = "http://localhost:8080";

const make_unit = (url?: string) => {
  // Nginx-unit server url
  url = url ?? unit_default_url;

  const init_config = () => {
    const object = {
      listeners: {},
      routes: {},
    };
    const data = JSON.stringify(object);
    const req = `curl -X PUT \ 
    --data-binary '${data}' \ 
    --unix-socket /run/nginx-unit.control.sock \ 
    ${url}/config`;
    return req;
  };
  const update_routes = (object: any) => {
    const data = JSON.stringify(object);
    const req = `curl -X PUT \ 
    --data-binary '${data}' \ 
    ${url}/config/routes`;
    return req;
  };

  const update_listeners = (object: any) => {
    const data = JSON.stringify(object);
    const req = `curl -X PUT \ 
    --data-binary '${data}' \ 
    ${url}/config/listeners`;
    return req;
  };

  /**
Create an nginx-unit route.
  */
  const make_route = ({ globals, name, ports }: Container): string[] => {
    const port = ports![0];
    const data: any = {};
    data[`${name}`] = [
      {
        match: {
          host: globals!.dns,
        },
        action: {
          proxy: `http://${port.ip}:${port.out}`,
        },
      },
    ];
    let req = update_routes(data);
    return [req];
  };

  /**
Create an nginx-unit listener.
  */
  const make_listener = ({ name }: Container): string[] => {
    let data = {
      // Listen on localhost
      "127.0.0.1:80": {
        pass: `routes/${name}`,
      },
    };
    let req = update_listeners(data);
    return [req];
  };

  return {
    init_config,
    make_listener,
    make_route,
  };
};

export { 
  make_unit,
  make_unit as nginx_unit };
