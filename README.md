# Introduction
The Clone-Production-DB-Service is a tool that is designed to help developers mimic a production environment for testing purposes. It accomplishes this by restoring a backup of the production database from an Amazon S3 bucket on a daily basis. This ensures that the database used for testing is as close to the production database as possible, without risking data loss or corruption.

## Purpose
The purpose of this service is to provide developers with a way to test their code in an environment that closely resembles production, without having to use live production data. By restoring the database on a daily basis, developers can be sure that their tests are using the most up-to-date version of the database.

## Implementation
The service is implemented as a script that runs on a separate virtual private server (VPS) instance. The script retrieves a backup of the production database from an S3 bucket, restores it, and sets it up for testing purposes. The service should be provisioned using PM2 to ensure that it runs continuously in the background.

## Configuration
To use this service, you will need to clone the .env.example to .env and define the S3 secrets and the cron configuration of how frequently this service should run. These parameters include the AWS access key ID, the AWS secret access key, and the name of the database that will be restored, optionally you could define the docker container name that the postgres service is running and the database name directly on the index.js.

```
NODE_ENV=production
DB_name=
DOCKER_CONTAINER=
CRON_TIME="* 5 * * *"
TZ=America/Los_Angeles
S3_KEY=
S3_SECRET=
```

## Usage
To use the service, simply run the script on the VPS instance. The script will automatically retrieve the latest backup of the production database from the specified S3 bucket, restore it, and set it up for testing purposes - please be aware that everyday the scripts will erase all data attached to this service, replicating the DB state from production.

## Conclusion
The Clone-Production-DB-Service is a valuable tool for developers who need to test their code in an environment that closely resembles production. By restoring the database on a daily basis, developers can be sure that their tests are using the most up-to-date version of the database. The service is easy to use and can be configured quickly, making it an essential tool for any development team.