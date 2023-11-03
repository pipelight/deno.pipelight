import type { Port, Globals } from "../../docker/mod.ts";
import { Container } from "../../docker/mod.ts";
// Nginx unti helpers

/**
Convert the given configuration object into a JSON string
And send it to nginx-unit unix socket with cURL.
*/
const init_config = () => {
  let object = {
    listeners: {},
    routes: {},
  };
  let data = JSON.stringify(object);
  let req = `curl -X PUT \ 
    --data-binary '${data}' \ 
    --unix-socket /run/nginx-unit.control.sock \ 
    http://localhost/config`;
  console.log(req);
  return req;
};
const update_routes = (object: any) => {
  let data = JSON.stringify(object);
  let req = `curl -X POST \ 
    --data-binary '${data}' \ 
    --unix-socket /run/nginx-unit.control.sock \ 
    http://localhost/config/routes`;
  console.log(req);
  return req;
};
const update_listeners = (object: any) => {
  let data = JSON.stringify(object);
  let req = `curl -X POST \ 
    --data-binary '${data}' \ 
    --unix-socket /run/nginx-unit.control.sock \ 
    http://localhost/config/listeners`;
  console.log(req);
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

export const unit = {
  init_config,
  make_listener,
  make_route,
};
