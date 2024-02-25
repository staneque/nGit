import fs from 'node:fs/promises'
import path from 'node:path'

export class Refs {
  constructor(pathname) {
    this.pathname = pathname
    this.headPath = path.join(this.pathname, 'HEAD')
  }

  async updateHead(oid) {
    const fd = await fs.open(this.headPath, 'w')
    await fs.write(fd, oid)
    await fs.close(fd)
  }

  async readHead() {
    try {
      await fs.access(this.headPath)

      const headContents = await fs.readFile(this.headPath, 'binary')

      return headContents.trim()
    } catch (err) {
      return false
    }
  }
}
