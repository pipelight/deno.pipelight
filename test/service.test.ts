import { Docker, DockerAutoParams } from "../mod.ts";
const params: DockerAutoParams = {
  globals: {
    version: "production",
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
          target: "/var/lib/postgresql/data",
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
          target: "/data",
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
      volumes: [
        {
          suffix: "data",
          source: "~/data",
          target: "/data",
        },
      ],
      ports: [{ out: 9282, in: 9000 }],
    },
  ],
};

// Service definition
export const docker = new Docker(params);
// console.log(docker);

// Deployment Pipeline

// Test getters
const api = docker.containers.get("api");
// console.log(api);
