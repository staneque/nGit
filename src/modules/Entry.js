export class Entry {
  constructor(name, oid) {
    this._name = name
    this._oid = oid
  }

  get name() {
    return this._name
  }

  get oid() {
    return this._oid
  }
}
