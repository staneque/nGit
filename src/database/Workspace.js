import fs from 'node:fs'
import path from 'node:path'

export class Workspace {
  static IGNORE = ['.', '..', '.git']

  constructor(pathname) {
    // Cwd
    this.pathname = pathname
  }

  listFiles() {
    return fs
      .readdirSync(this.pathname)
      .filter(file => !Workspace.IGNORE.includes(file))
  }

  readFile(file) {
    return fs.readFileSync(path.join(this.pathname, file))
  }
}
