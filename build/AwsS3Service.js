"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsS3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const { Readable } = require("stream");
const fs_1 = __importDefault(require("fs"));
const AwsS3Service = class {
    constructor({ S3_REGION, S3_BUCKET }) {
        this.Bucket = S3_BUCKET;
        this._s3 = new client_s3_1.S3Client({
            region: S3_REGION,
            credentials: {
                accessKeyId: process.env.S3_KEY,
                secretAccessKey: process.env.S3_SECRET
            },
        });
    }
    async listAwsObjects(path) {
        const command = new client_s3_1.ListObjectsV2Command({ Bucket: this.Bucket, Prefix: path });
        const response = await this._s3.send(command);
        return response.Contents?.sort((a, b) => b.LastModified.getTime() - a.LastModified.getTime()).map((object) => object.Key) ?? [];
    }
    async getObjectAndSaveLocally({ key, localFilePath }) {
        const command = new client_s3_1.GetObjectCommand({ Bucket: this.Bucket, Key: key });
        const response = await this._s3.send(command);
        const readStream = Readable.from(response.Body);
        const writeStream = fs_1.default.createWriteStream(localFilePath);
        readStream.pipe(writeStream);
        await new Promise((resolve, reject) => {
            writeStream.on("finish", resolve);
            writeStream.on("error", reject);
        });
        console.log(`Object saved to ${localFilePath}`);
        return localFilePath;
    }
};
exports.AwsS3Service = AwsS3Service;
