import chalk from 'chalk'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'
const execPromise = promisify(exec)

export const execAsync = async (command: string, dir = '') => {
  console.log(`\n *************************************************************************************** `)
  console.log(chalk.blue(`▶ RUNNING: ${chalk.white(`"${command}"`)}`))

  const newPath = path.join(process.cwd(), dir)

  return execPromise(command, { cwd: newPath })
    .then(({ stdout, stderr }: { stdout: string, stderr: string}) => {
      console.log(stdout)
      console.log(chalk.green(`✅ FINISHED: ${chalk.white(`"${command}"`)}`))
      console.log(` ***************************************************************************************  \n`)
    })
    .catch(({ stdout, stderr }: { stdout: string, stderr: string}) => {
      console.log(chalk.red(`❌ ERROR ON: ${chalk.white(`"${command}"`)}`))
      console.error(stdout)
      console.error(stderr)
    })
}