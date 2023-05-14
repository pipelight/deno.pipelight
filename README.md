# Pipelight Helpers

A Lightweight CI/CD tool.
[Full Documentation](https://pipelight.dev).

## Types

Export types to create a pipeline object.

## Docker

### Usage

Create ana object with your docker configuration.
With informations about images, containers, volumes and networks.

```ts
const params: DockerParams = {
  containers: [
    {
      name: "my_container",
      image: {
        name: "node:latest",
      },
    },
  ],
};
const docker = new Docker(params);
```

Insert the commands in your pipeline.

```ts
const pipeline = {
  name: "deploy",
  steps: [
    {
      name: "dockerize",
      commands: docker.to_commands(),
    },
  ],
};

docker.to_commands();
```

Or with the composition API helpers

```ts
// create a pipeline
pipeline("deploy", () => [
  // create a step
  step("dockerize", () => docker.to_commands()),
]);
```

## NPM

### Build

```sh
tsc
```
