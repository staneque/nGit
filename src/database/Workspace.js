import fs from 'node:fs/promises'
import path from 'node:path'

export class Workspace {
  static IGNORE = ['.', '..', '.git']

  constructor(pathname) {
    // CWD
    this.pathname = pathname
  }

  async listFiles(pathname = this.pathname) {
    const filenames = await fs.readdir(pathname)

    const fPromises = filenames
      .filter(file => !Workspace.IGNORE.includes(file))
      .map(async filename => {
        const fullPath = path.join(pathname, filename)
        const stats = await fs.stat(fullPath)

        if (stats.isDirectory()) {
          return this.listFiles(fullPath)
        } else {
          return path.relative(this.pathname, fullPath)
        }
      })

    const filesList = await Promise.all(fPromises)

    return filesList.flat()
  }

  async readFile(file) {
    return fs.readFile(path.join(this.pathname, file))
  }

  async getFileStats(file) {
    return fs.stat(path.join(this.pathname, file))
  }
}
