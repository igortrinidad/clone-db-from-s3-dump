"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execAsync = void 0;
const chalk_1 = __importDefault(require("chalk"));
const node_child_process_1 = require("node:child_process");
const node_util_1 = require("node:util");
const node_path_1 = __importDefault(require("node:path"));
const execPromise = (0, node_util_1.promisify)(node_child_process_1.exec);
const execAsync = async (command, dir = '') => {
    console.log(`\n *************************************************************************************** `);
    console.log(chalk_1.default.blue(`▶ RUNNING: ${chalk_1.default.white(`"${command}"`)}`));
    const newPath = node_path_1.default.join(process.cwd(), dir);
    return execPromise(command, { cwd: newPath })
        .then(({ stdout, stderr }) => {
        console.log(stdout);
        console.log(chalk_1.default.green(`✅ FINISHED: ${chalk_1.default.white(`"${command}"`)}`));
        console.log(` ***************************************************************************************  \n`);
    })
        .catch(({ stdout, stderr }) => {
        console.log(chalk_1.default.red(`❌ ERROR ON: ${chalk_1.default.white(`"${command}"`)}`));
        console.error(stdout);
        console.error(stderr);
    });
};
exports.execAsync = execAsync;
