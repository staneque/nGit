export class Tree {
  constructor(entries) {
    this.MODE = '100644'
    this.entries = entries
  }

  get type() {
    return 'tree'
  }

  toString() {
    const entries = this.entries
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(entry => {
        /*
         * Generate a stqring for each entry consisting of:
         * mode 100644 + space + filename + nullbyte + 20 bytes for the objectID
         */
        const nameString = `${this.MODE} ${entry.name}\0`

        const bufName = Buffer.from(nameString, 'binary')
        const bufOid = Buffer.from(entry.oid, 'hex')

        return Buffer.concat([bufName, bufOid])
      })

    return Buffer.concat(entries).toString('binary')
  }
}
