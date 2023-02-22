"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreBackup = void 0;
const execAsync_1 = require("./execAsync");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const AwsS3Service_1 = require("./AwsS3Service");
const removeOlderFiles_1 = require("./removeOlderFiles");
const restoreBackup = async ({ DOCKER_CONTAINER = '', DB_NAME = '', S3_FOLDER = '', S3_REGION = '', S3_BUCKET = '' } = {}) => {
    DOCKER_CONTAINER = process.env.DOCKER_CONTAINER || DOCKER_CONTAINER;
    DB_NAME = process.env.DB_NAME || DB_NAME;
    S3_FOLDER = process.env.S3_FOLDER || S3_FOLDER;
    S3_REGION = process.env.S3_REGION || S3_REGION;
    S3_BUCKET = process.env.S3_BUCKET || S3_BUCKET;
    const s3Service = new AwsS3Service_1.AwsS3Service({ S3_REGION, S3_BUCKET });
    const dumps = await s3Service.listAwsObjects(S3_FOLDER);
    if (dumps.length === 0) {
        console.log('No backups found, exiting...');
        return;
    }
    const latestBackupS3ObjectKey = dumps[0];
    console.log(`Latest backup found: ${latestBackupS3ObjectKey}`);
    const latestBackupFilename = latestBackupS3ObjectKey.split('/')[latestBackupS3ObjectKey.split('/').length - 1];
    const localFilePath = path_1.default.join(__dirname, `/../tmp/${latestBackupFilename}`);
    let backupFileLocal;
    if (fs_1.default.existsSync(localFilePath)) {
        console.log('File already exists locally, using it to restore...');
        backupFileLocal = localFilePath;
    }
    else {
        console.log('File not found locally, downloading from S3 and storing locally...');
        backupFileLocal = await s3Service.getObjectAndSaveLocally({ key: latestBackupS3ObjectKey, localFilePath });
    }
    await (0, execAsync_1.execAsync)(`docker exec -i ${DOCKER_CONTAINER} psql -U postgres -d postgres -c "DROP DATABASE ${DB_NAME} WITH(force);"`);
    await (0, execAsync_1.execAsync)(`docker exec -i ${DOCKER_CONTAINER} psql -U postgres -d postgres -c "CREATE DATABASE ${DB_NAME};"`);
    await (0, execAsync_1.execAsync)(`docker exec -i ${DOCKER_CONTAINER} psql -U postgres ${DB_NAME} < ${backupFileLocal}`);
    (0, removeOlderFiles_1.removeOlderFiles)(path_1.default.join(__dirname, `/../tmp/`));
};
exports.restoreBackup = restoreBackup;
