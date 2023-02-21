
import { execAsync } from './execAsync'
import fs from 'fs'
import path from 'path'
import { AwsS3Service } from './AwsS3Service'
import { removeOlderFiles } from './removeOlderFiles'

interface RestoreBackupInputInterface {
  NODE_ENV?: string,
  DOCKER_CONTAINER?: string,
  DB_NAME?: string,
}

export const restoreBackup = async ({ NODE_ENV = 'production', DOCKER_CONTAINER = 'cee_dev_postgress', DB_NAME = 'cee' }: RestoreBackupInputInterface = {}) => {

  NODE_ENV = process.env.NODE_ENV || NODE_ENV
  DOCKER_CONTAINER = process.env.DOCKER_CONTAINER || DOCKER_CONTAINER
  DB_NAME = process.env.DB_NAME || DB_NAME

  const s3Service = new AwsS3Service({ S3_REGION: 'us-west-1', S3_BUCKET: 'cee-db-backup-permanent' })

  const s3BackupFolder = NODE_ENV === 'production' ? 'cee_production' : 'cee_staging'

  const dumps = await s3Service.listAwsObjects(s3BackupFolder)

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