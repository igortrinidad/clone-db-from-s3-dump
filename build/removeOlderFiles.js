"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOlderFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const removeOlderFiles = (path) => {
    const files = fs_1.default.readdirSync(path);
    files.sort((a, b) => {
        return fs_1.default.statSync(`${path}/${b}`).mtime.getTime() - fs_1.default.statSync(`${path}/${a}`).mtime.getTime();
    });
    for (let i = 1; i < files.length; i++) {
        fs_1.default.unlinkSync(`${path}/${files[i]}`);
    }
};
exports.removeOlderFiles = removeOlderFiles;
