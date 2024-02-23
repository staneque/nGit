import fs from 'node:fs'
import path from 'node:path'

export class Workspace {
  static IGNORE = ['.', '..', '.git']

  constructor(pathname) {
    // Cwd
    this.pathname = pathname
  }

  listFiles() {
    return fs
      .readdirSync(this.pathname)
      .filter(file => !Workspace.IGNORE.includes(file))
  }

  readFile(file) {
    return fs.readFileSync(path.join(this.pathname, file))
  }
}

/*
 * def read_file(path) File.read(@pathname.join(path))
 * end
 * 
 * # workspace.rb
 * class Workspace
 * IGNORE = [".", "..", ".git"]
 * def initialize(pathname) @pathname = pathname
 * end
 * def list_files Dir.entries(@pathname) - IGNORE
 * end end
 */
