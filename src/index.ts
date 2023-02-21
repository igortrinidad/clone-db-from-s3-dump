
import { CronJob }  from 'cron'
import { restoreBackup } from './restoreBackup'
import dotenv from 'dotenv'
dotenv.config()

export default ( async () => {

  const cron_time = process.env.CRON_TIME
  const timezone = process.env.TZ

  console.log(`**** Scheduling backups to run at ${ cron_time } - ${ timezone } *****`)

  new CronJob(cron_time || '* * * * * *', async () => {
    await restoreBackup()
  }, null, true, timezone)

})()