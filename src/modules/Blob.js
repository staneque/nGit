export class Blob {
  constructor(data) {
    this.data = data
  }

  get type() {
    return 'blob'
  }

  toString() {
    return this.data
  }
}
