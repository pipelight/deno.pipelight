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

  const update_certificates = ({ name, id }: Container) => {
    const req = `curl -X PUT \ 
    --data-binary @bundle_${name}.pem \ 
    ${url}/certificates/${name}`;
    return req;
  };

  /**
Create an nginx-unit route.
  */
  const make_routes = ({ globals, name, ports }: Container): string[] => {
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
  const make_listeners = ({ name }: Container): string[] => {
    let data = {
      // Listen on localhost
      "127.0.0.1:80": {
        pass: `routes/${name}`,
      },
      "127.0.0.1:443": {
        pass: `routes/${name}`,
        tls: {
          "certificate": `${name}`
        }
      },
    };
    let req = update_listeners(data);
    return [req];
  };
  /**
Create an nginx-unit listener.
  */
  const make_certificates = (container: Container): string[] => {
    const name = container.name;
    // Generate a dummy certificate
    const dummy_cert =
      `openssl req -x509 -newkey rsa:4096 -keyout key_${name}.pem -out cert_${name}.pem -sha256 -days 365 -nodes -subj '/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=CompanySectionName/CN=CommonNameOrHostname'`;

    // const bundle = `cat cert_${name}.pem ca.pem key_${name}.pem > bundle_${name}.pem`;
    const bundle = `cat cert_${name}.pem key_${name}.pem > bundle_${name}.pem`;
    const remove_tmp_files =
      `rm cert_${name}.pem key_${name}.pem bundle_${name}.pem`;

    return [
      dummy_cert,
      bundle,
      update_certificates(container),
      remove_tmp_files,
    ];
  };

  const expose = (container: Container) => {
    return [
      ...make_routes(container),
      ...make_listeners(container),
      ...make_certificates(container),
    ];
  };

  return {
    init_config,
    expose,
    make_listeners,
    make_routes,
    make_certificates,
  };
};

export { make_unit, make_unit as nginx_unit };
