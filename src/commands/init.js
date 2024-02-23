import path from 'node:path'
import fs from 'node:fs'

export const command = 'init'
export const desc = 'Create an empty repo'

export const handler = function (argv) {
  const currentDir = process.cwd()

  const gitPath = path.resolve(currentDir, '.git')

  try {
    ['objects', 'refs'].forEach(dir => {
      fs.mkdirSync(path.join(gitPath, dir), { recursive: true })
    })

    console.log(`Initialized empty nGit repository in ${currentDir}`)

    process.exit(0)
  } catch (error) {
    console.error(`fatal: ${error.message}`)

    process.exit(1)
  }
}
