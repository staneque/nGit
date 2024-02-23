export class Entry {
  constructor(name, oid) {
    this.name = name
    this.oid = oid
  }

  name() {
    return this.name
  }

  oid() {
    return this.oid
  }
}
