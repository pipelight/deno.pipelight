import { Docker, Container, Image } from "../../mod.ts";
import { Pipeline, Step, StepOrParallel, Mode } from "../../mod.ts";
import { pipeline, parallel, step } from "../helpers/mod.ts";
import { ssh } from "../helpers/mod.ts";

export const useTemplate = () => ({
  deploy,
});

// IMAGES
/**
 * parrallel build images locally or on remote
 */
const build_images = (docker: Docker, host?: string): Step[] => {
  const steps: Step[] = [];
  for (const e of docker.images) {
    steps.push(
      step(`build image ${e.name}`, () =>
        host ? ssh(host, () => e.create()) : e.create(),
      ),
    );
  }
  return steps;
};

/**
 * parrallel send images to remote
 */
const send_images = (docker: Docker, host?: string): Step[] => {
  const steps: Step[] = [];
  for (const e of docker.images) {
    steps.push(step(`send image ${e.name} to remote`, () => e.send(host!)));
  }
  return steps;
};

// NETWORKS
/**
 * parrallel create networks locally or on remote
 */
const ensure_networks = (docker: Docker, host?: string): Step[] => {
  const steps: Step[] = [];
  for (const e of docker.networks) {
    steps.push(
      step(`ensure network ${e.name}`, () =>
        host ? ssh(host, () => e.create()) : e.create(),
      ).set_mode(Mode.JumpNextOnFailure),
    );
  }
  return steps;
};

/**
 * parrallel ensure volume locally or on remote
 */
const ensure_volumes = (docker: Docker, host?: string): Step[] => {
  const steps: Step[] = [];
  for (const e of docker.volumes) {
    steps.push(
      step(`ensure volumes ${e.name}`, () =>
        host ? ssh(host, () => e.create()) : e.create(),
      ),
    );
  }
  return steps;
};

// VOLUMES
/**
 * parrallel clean volumes locally or on remote
 */
const clean_volumes = (docker: Docker, host?: string): Step[] => {
  const steps: Step[] = [];
  for (const e of docker.volumes) {
    if (!!e.source) {
      steps.push(
        step(`clean local persisted volumes ${e.name}`, () =>
          host ? ssh(host, () => e.remove()) : e.remove(),
        ),
      );
    }
  }
  return steps;
};

// CONTAINERS
/**
 * parrallel create and run containers locally or on remote
 */
const create_containers = (docker: Docker, host?: string): Step[] => {
  const steps: Step[] = [];
  for (const e of docker.containers) {
    steps.push(
      step(`run containers ${e.name}`, () => {
        if (!!host) {
          return ssh(host, () => e.create());
        } else {
          return e.create();
        }
      }),
    );
  }
  return steps;
};
/**
 * parrallel create and run containers locally or on remote
 */
const clean_containers = (docker: Docker, host?: string): Step[] => {
  const steps: Step[] = [];
  for (const e of docker.containers) {
    steps.push(
      step(`clean containers ${e.name}`, () => {
        if (!!host) {
          return ssh(host, () => e.remove());
        } else {
          return e.remove();
        }
      }),
    );
  }
  return steps;
};

const ensure_containers = (docker: Docker, host?: string): Step[] => {
  const steps: Step[] = [];
  for (const e of docker.containers) {
    steps.push(
      step(`ensure container ${e.name}`, () => {
        if (!!host) {
          return [
            ...ssh(host, () => e.remove()),
            ...ssh(host, () => e.create()),
          ];
        } else {
          return [...e.remove(), ...e.create()];
        }
      }).set_mode(Mode.ContinueOnFailure),
    );
  }
  return steps;
};

// Deploy to a single host
const deploy = (docker: Docker, host?: string): Pipeline => {
  const my_pipeline = pipeline("deploy_to_single_host", () => {
    const steps: StepOrParallel[] = [];
    if (!!docker.images.length) {
      steps.push(parallel(() => build_images(docker, host ? host : undefined)));
      steps.push(parallel(() => send_images(docker, host ? host : undefined)));
    }
    if (!!docker.networks.length) {
      steps.push(
        parallel(() => ensure_networks(docker, host ? host : undefined)),
      );
    }
    if (!!docker.volumes.length) {
      steps.push(
        parallel(() => ensure_volumes(docker, host ? host : undefined)),
      );
    }
    if (!!docker.containers.length) {
      steps.push(
        parallel(() => ensure_containers(docker, host ? host : undefined)),
      );
    }
    return steps;
  });
  return my_pipeline;
};
