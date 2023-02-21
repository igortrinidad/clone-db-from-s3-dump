"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const restoreBackup_1 = require("./restoreBackup");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = (async () => {
    const cron_time = process.env.CRON_TIME;
    const timezone = process.env.TZ;
    console.log(`**** Scheduling backups to run at ${cron_time} - ${timezone} *****`);
    new cron_1.CronJob(cron_time || '* * * * * *', async () => {
        await (0, restoreBackup_1.restoreBackup)();
    }, null, true, timezone);
})();
