import { Docker, Container, Image } from "../../../mod.ts";
import { Pipeline, Step, Mode } from "../../../mod.ts";
import { pipeline, parallel, step, ssh } from "../../../mod.ts";
import { v1 } from "https://deno.land/std/uuid/mod.ts";

export const useTemplate = () => ({
  deploy,
});

// Deploy to a single host
const deploy = (docker: Docker, host?: string): Pipeline => {
  const my_pipeline = pipeline("deploy_to_single_host", () => {
    const steps = [];

    // Parallele image building
    const build_images = parallel(() => {
      const steps: Step[] = [];
      for (const e of docker.images) {
        steps.push(
          step(`build image ${e.name}`, () =>
            // host ? ssh([host], e.create()) : e.create()
            e.create()
          )
        );
      }
      return steps;
    });

    // Parallele image sending
    const send_images = parallel(() => {
      const steps: Step[] = [];
      for (const e of docker.images) {
        steps.push(step(`send image ${e.name} to remote`, () => e.send(host!)));
      }
      return steps;
    });

    const networks = parallel(() => {
      const steps: Step[] = [];
      for (const e of docker.networks) {
        steps.push(
          step(
            `ensure network ${e.name}`,
            () => (host ? ssh(host, () => e.create()) : e.create()),
            {
              mode: "jump_next",
            }
          )
        );
      }
      return steps;
    });
    networks.mode = "continue" as Mode;

    const clean_volumes = parallel(() => {
      const steps: Step[] = [];
      for (const e of docker.volumes) {
        if (!!e.source) {
          steps.push(
            step(`clean local persisted volumes ${e.name}`, () =>
              host ? ssh(host, () => e.remove()) : e.remove()
            )
          );
        }
      }
      return steps;
    });
    clean_volumes.mode = "jump_next" as Mode;

    const volumes = parallel(() => {
      const steps: Step[] = [];
      for (const e of docker.volumes) {
        steps.push(
          step(`ensure volumes ${e.name}`, () =>
            host ? ssh(host, () => e.create()) : e.create()
          )
        );
      }
      return steps;
    });

    const clean_containers = parallel(() => {
      const steps: Step[] = [];
      for (const e of docker.containers) {
        steps.push(
          step(`clean containers ${e.name}`, () => {
            if (!!host) {
              return ssh(host, () => e.remove());
            } else {
              return e.remove();
            }
          })
        );
      }
      return steps;
    });
    clean_containers.mode = "jump_next" as Mode;

    const containers = parallel(() => {
      const steps: Step[] = [];
      for (const e of docker.containers) {
        steps.push(
          step(`run containers ${e.name}`, () => {
            if (!!host) {
              return ssh(host, () => e.create());
            } else {
              return e.create();
            }
          })
        );
      }
      return steps;
    });

    if (!!docker.images.length) {
      steps.push(build_images);
      if (!!host) {
        steps.push(send_images);
      }
    }
    if (!!docker.networks.length) {
      steps.push(networks);
    }
    if (!!docker.containers.length) {
      steps.push(clean_containers);
    }
    if (!!docker.volumes.length) {
      if (!!clean_volumes.parallel.length) steps.push(clean_volumes);
      steps.push(volumes);
    }
    if (!!docker.containers.length) {
      steps.push(containers);
    }
    return steps;
  });

  return my_pipeline;
};
