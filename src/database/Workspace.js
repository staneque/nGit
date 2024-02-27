import fs from 'node:fs/promises'
import path from 'node:path'

export class Workspace {
  static IGNORE = ['.', '..', '.git']

  constructor(pathname) {
    // Cwd
    this.pathname = pathname
  }

  async listFiles() {
    const files = await fs.readdir(this.pathname)
    return files.filter(file => !Workspace.IGNORE.includes(file))
  }

  async readFile(file) {
    return fs.readFile(path.join(this.pathname, file))
  }

  async getFileStats(file) {
    return fs.stat(path.join(this.pathname, file))
  }
}
