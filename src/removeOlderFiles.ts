import fs from 'fs'

export const removeOlderFiles = (path: string) => {

  const files = fs.readdirSync(path)

  files.sort((a, b) => {
    return fs.statSync(`${path}/${b}`).mtime.getTime() - fs.statSync(`${path}/${a}`).mtime.getTime()
  })

  for (let i = 1; i < files.length; i++) {
    fs.unlinkSync(`${path}/${files[i]}`)
  }

}