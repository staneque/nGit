export class Author {
  constructor(name, email, timestamp) {
    this.name = name
    this.email = email
    this.time = timestamp
  }

  toString() {
    return `${this.name} <${this.email}> ${this.time}`
  }
}
