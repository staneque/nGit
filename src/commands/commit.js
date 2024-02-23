import path from 'node:path'
import { Workspace, Database, Blob, Tree, Entry } from '../modules/index.js'

export const command = 'commit'
export const desc = 'Create a commit'

/*
 * when "commit"
 * root_path = Pathname.new(Dir.getwd) git_path = root_path.join(".git")
 * db_path = git_path.join("objects")
 * workspace = Workspace.new(root_path) puts workspace.list_files
 */
/* 
 *undefined
 */
export const handler = function () {
  const currentPath = process.cwd()
  const gitPath = path.resolve(currentPath, '.git')
  const dbPath = path.join(gitPath, 'objects')

  const workspace = new Workspace(currentPath)
  const db = new Database(dbPath)

  try {
    const files = workspace.listFiles()

    const entries = files.map(file => {
      const fileData = workspace.readFile(file)
      const blob = new Blob(fileData)

      db.store(blob)

      return new Entry(file, blob.oid)
    })

    const tree = new Tree(entries)

    db.store(tree)

    console.log('tree', tree.oid)
    process.exit(0)
  } catch (error) {
    console.error(error)

    process.exit(1)
  }
}
