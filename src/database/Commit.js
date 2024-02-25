export class Commit {
  constructor(parent, tree, author, message) {
    this.parent = parent
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
      `tree ${this.tree}${this.parent ? '\nparent ' + this.parent : ''}`,
      `author ${this.author}`,
      `committer ${this.author}`,
      '',
      this.message,
    ]

    return lines.join('\n')
  }
}
