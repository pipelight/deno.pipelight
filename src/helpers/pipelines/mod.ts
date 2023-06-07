import { Docker, Container, Image } from "../../../mod.ts";
import { Pipeline, Step, Mode } from "../../../mod.ts";
import { pipeline, parallel, step, ssh } from "../../../mod.ts";
import { v1 } from "https://deno.land/std/uuid/mod.ts";

export const useTemplate = () => ({
  deploy,
  test,
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
        steps.push(
          step(`send image ${e.name} to remote`, () => e.send([host!]))
        );
      }
      return steps;
    });

    const networks = parallel(() => {
      const steps: Step[] = [];
      for (const e of docker.networks) {
        steps.push(
          step(
            `ensure network ${e.name}`,
            () => (host ? ssh([host], e.create()) : e.create()),
            {
              mode: "jump_next",
            }
          )
        );
      }
      return steps;
    });
    networks.mode = "continue" as Mode;

    const volumes = parallel(() => {
      const steps: Step[] = [];
      for (const e of docker.volumes) {
        steps.push(
          step(`ensure volumes ${e.name}`, () =>
            host ? ssh([host], e.create()) : e.create()
          )
        );
      }
      return steps;
    });

    const containers = parallel(() => {
      const steps: Step[] = [];
      for (const e of docker.containers) {
        steps.push(
          step(
            `clean containers ${e.name}`,
            () => {
              if (!!host) {
                return ssh([host], e.remove());
              } else {
                return e.remove();
              }
            },
            {
              mode: "continue",
            }
          )
        );
        steps.push(
          step(`run containers ${e.name}`, () => {
            if (!!host) {
              return ssh([host], e.create());
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
    if (!!docker.volumes.length) {
      steps.push(volumes);
    }
    if (!!docker.containers.length) {
      steps.push(containers);
    }
    return steps;
  });

  return my_pipeline;
};

const test = (image: Image, commands: string[], host?: string): Pipeline => {
  const container = new Container({
    name: "test_" + v1.generate(),
    image: {
      name: image.name,
    },
  });
  const clean: Step = step("delete container", () =>
    host ? ssh([host], container.exec(commands)) : container.exec(commands)
  );

  const my_pipeline = pipeline("run_tests_in_container", () => [
    step("ensure image", () => image.create(), {
      mode: "jump_next",
    }),
    step("build container", () =>
      host ? ssh([host], container.create()) : container.create()
    ),
    step("run in container", () =>
      host ? ssh([host], container.exec(commands)) : container.exec(commands)
    ),
  ]);

  my_pipeline.on_success = [clean];
  my_pipeline.on_failure = [clean];
  my_pipeline.on_abortion = [clean];

  return my_pipeline;
};
