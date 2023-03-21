"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = void 0;
const exec = async (cmd) => {
    const process = new Deno.Command("sh", {
        args: ["-c", cmd],
    });
    const { code, stdout, stderr } = await process.output();
    const res = new TextDecoder().decode(stdout).replace(/\s+$/, "");
    const err = new TextDecoder().decode(stderr).replace(/\s+$/, "");
    if (!code) {
        return res;
    }
    else {
        return err;
    }
};
exports.exec = exec;
