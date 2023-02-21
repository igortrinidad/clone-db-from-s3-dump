import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3'
const { Readable } = require("stream")
import fs from 'fs'

interface AwsS3ServiceConstructorInput {
  S3_REGION: string
  S3_BUCKET: string
}

export const AwsS3Service = class {
  Bucket: string
  _s3: S3Client

  constructor({ S3_REGION, S3_BUCKET }: AwsS3ServiceConstructorInput) {
    this.Bucket = S3_BUCKET;

    this._s3 = new S3Client({
      region: S3_REGION,
      credentials: {
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET
      },
    })
  }

  async listAwsObjects(path: string): Promise<Array<string>> {
    const command = new ListObjectsV2Command({ Bucket: this.Bucket, Prefix: path })
    const response = await this._s3.send(command)
    return response.Contents?.sort((a, b) => b.LastModified.getTime() - a.LastModified.getTime()).map((object) => object.Key) ?? []
  }

  async getObjectAndSaveLocally({ key, localFilePath }: { key: string, localFilePath: string }): Promise<any> {
    const command = new GetObjectCommand({ Bucket: this.Bucket, Key: key })
    const response = await this._s3.send(command)
    
    const readStream = Readable.from(response.Body)
    const writeStream = fs.createWriteStream(localFilePath)

    readStream.pipe(writeStream)

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve)
      writeStream.on("error", reject)
    })

    console.log(`Object saved to ${localFilePath}`)

    return localFilePath
  }

}
