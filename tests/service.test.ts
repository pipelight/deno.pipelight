import { Service, ServiceParams } from "../mod.ts";
const params: ServiceParams = {
  globals: {
    version: "production",
    host: "linode",
    dns: "itsdizygote.com",
  },
  containers: [
    {
      suffix: "db",
      image: {
        suffix: "db",
      },
      networks: [
        {
          suffix: "net",
          // ip: env.DB_IP,
        },
      ],
      ports: [{ out: 5436, in: 5432 }],
      volumes: [
        {
          suffix: "data",
          path: {
            inside: "/var/lib/postgresql/data",
          },
        },
      ],
    },
    {
      suffix: "io",
      image: {
        suffix: "io",
      },
      networks: [
        {
          suffix: "net",
          // ip: env.IO_IP,
        },
      ],
      ports: [{ out: 9001, in: 9000 }],
      volumes: [
        {
          suffix: "data",
          path: {
            inside: "/data",
          },
        },
      ],
      // envs: [
      //   `MINIO_ACCESS_KEY=${env.MINIO_ACCESS_KEY}`,
      //   `MINIO_SECRET_KEY=${env.MINIO_SECRET_KEY}`,
      // ],
    },
    {
      suffix: "api",
      image: {
        suffix: "api",
      },
      networks: [
        {
          suffix: "net",
          // ip: env.API_IP,
        },
      ],
      ports: [{ out: 9282, in: 9000 }],
    },
  ],
};
const service = new Service(params);
console.log(service);
