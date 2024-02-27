import { constants } from 'node:fs'
export class Entry {
  constructor(name, oid, stat) {
    this._name = name
    this._oid = oid
    this.stat = stat
  }

  get name() {
    return this._name
  }

  get oid() {
    return this._oid
  }

  get mode() {
    const isExec = !!(
      this.stat.mode & constants.S_IXUSR ||
      this.stat.mode & constants.S_IXGRP ||
      this.stat.mode & constants.S_IXOTH
    )

    return isExec ? '100755' : '100644'
  }
}
