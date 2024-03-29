export class Tree {
  constructor(entries) {
    this.entries = entries
  }

  get type() {
    return 'tree'
  }

  get oid() {
    return this._oid
  }

  set oid(oid) {
    this._oid = oid
  }

  toString() {
    const entries = this.entries
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(entry => {
        /*
         * Generate a stqring for each entry consisting of:
         * mode 100644 + space + filename + nullbyte + 20 bytes for the objectID
         */
        const nameString = `${entry.mode} ${entry.name}\0`
        const bufName = Buffer.from(nameString, 'binary')
        const bufOid = Buffer.from(entry.oid, 'hex')

        return Buffer.concat([bufName, bufOid])
      })

    return Buffer.concat(entries).toString('binary')
  }
}
