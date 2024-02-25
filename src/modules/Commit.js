export class Commit {
  constructor(tree, author, message) {
    this.tree = tree // tree oid
    this.author = author
    this.message = message
  }

  get type() {
    return 'commit'
  }

  get oid() {
    return this._oid
  }

  set oid(oid) {
    this._oid = oid
  }

  toString() {
    const lines = [
      `tree ${this.tree}`,
      `author ${this.author}`,
      `committer ${this.author}`,
      '',
      this.message,
    ]

    return lines.join('\n')
  }
}
