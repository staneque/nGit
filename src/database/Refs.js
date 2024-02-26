import fs from 'node:fs'
import path from 'node:path'
import { LockFile } from './Lockfile.js'

class LockDenied extends Error {}

export class Refs {
  constructor(pathname) {
    this.pathname = pathname
    this.headPath = path.join(this.pathname, 'HEAD')
    this.lockFile = new LockFile(this.headPath)
  }

  updateHead(commitOid) {
    // Prevent different instances of nGit both moving .git/HEAD at the same time.
    if (!this.lockFile.holdForUpdate()) {
      throw new LockDenied(`Could not acquire lock on file: ${this.headPath}`)
    }

    this.lockFile.write(commitOid)
    this.lockFile.write('\n')
    this.lockFile.commit()
  }

  readHead() {
    try {
      const headContents = fs.readFileSync(this.headPath, 'binary')

      return headContents.trim()
    } catch (err) {
      return null
    }
  }
}
