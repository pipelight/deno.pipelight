import { useTemplate } from "../mod.ts";
// Depends on another test
import { docker } from "./service.test.ts";

const { deploy } = useTemplate();
const my_pipeline = deploy(docker);
// const my_pipeline = deploy_single_host(docker, "linode");
// console.log(
//   Deno.inspect(my_pipeline, {
//     showHidden: false,
//     depth: null,
//     colors: true,
//   })
// );
