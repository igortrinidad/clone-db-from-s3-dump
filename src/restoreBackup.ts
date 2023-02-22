
import { execAsync } from './execAsync'
import fs from 'fs'
import path from 'path'
import { AwsS3Service } from './AwsS3Service'
import { removeOlderFiles } from './removeOlderFiles'

interface RestoreBackupInputInterface {
  DOCKER_CONTAINER?: string,
  DB_NAME?: string,
  S3_FOLDER? : string
  S3_REGION? : string
  S3_BUCKET? : string
}

export const restoreBackup = async ({ DOCKER_CONTAINER = '', DB_NAME = '', S3_FOLDER = '', S3_REGION = '', S3_BUCKET = '' }: RestoreBackupInputInterface = {}) => {

  DOCKER_CONTAINER = process.env.DOCKER_CONTAINER || DOCKER_CONTAINER
  DB_NAME = process.env.DB_NAME || DB_NAME
  S3_FOLDER = process.env.S3_FOLDER || S3_FOLDER
  S3_REGION = process.env.S3_REGION || S3_REGION
  S3_BUCKET = process.env.S3_BUCKET || S3_BUCKET

  const s3Service = new AwsS3Service({ S3_REGION, S3_BUCKET })

  const dumps = await s3Service.listAwsObjects(S3_FOLDER)

  if(dumps.length === 0) {
    console.log('No backups found, exiting...')
    return
  }

  const latestBackupS3ObjectKey = dumps[0]

  console.log(`Latest backup found: ${ latestBackupS3ObjectKey }`)

  const latestBackupFilename = latestBackupS3ObjectKey.split('/')[latestBackupS3ObjectKey.split('/').length-1]

  const localFilePath = path.join(__dirname, `/../tmp/${ latestBackupFilename }`)

  let backupFileLocal
  if(fs.existsSync(localFilePath)) {
    console.log('File already exists locally, using it to restore...')
    backupFileLocal = localFilePath
  } else {
    console.log('File not found locally, downloading from S3 and storing locally...')
    backupFileLocal = await s3Service.getObjectAndSaveLocally({ key: latestBackupS3ObjectKey, localFilePath })
  }

  await execAsync(`docker exec -i ${ DOCKER_CONTAINER } psql -U postgres -d postgres -c "DROP DATABASE ${ DB_NAME } WITH(force);"`)
  await execAsync(`docker exec -i ${ DOCKER_CONTAINER } psql -U postgres -d postgres -c "CREATE DATABASE ${ DB_NAME };"`)
  await execAsync(`docker exec -i ${ DOCKER_CONTAINER } psql -U postgres ${ DB_NAME } < ${ backupFileLocal }`)

  removeOlderFiles(path.join(__dirname, `/../tmp/`))

}