import fs from 'node:fs'
import path from 'node:path'

export class Refs {
  constructor(pathname) {
    this.pathname = pathname
    this.headPath = path.join(this.pathname, 'HEAD')
  }

  updateHead(oid) {
    const fd = fs.openSync(this.headPath, 'w')
    fs.writeFileSync(fd, oid)
    fs.closeSync(fd)
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
