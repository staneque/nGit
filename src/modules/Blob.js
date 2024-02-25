export class Blob {
  constructor(data) {
    this.data = data
  }

  get oid() {
    return this._oid
  }

  set oid(oid) {
    this._oid = oid
  }

  get type() {
    return 'blob'
  }

  toString() {
    return this.data
  }
}
