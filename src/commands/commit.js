import path from 'node:path'
import { Workspace, Database, Blob, Tree, Entry } from '../modules/index.js'

export const command = 'commit'
export const desc = 'Create a commit'
export const builder = yargs => {
  return yargs.option('m', {
    describe: 'commit message',
    demandOption: true,
    type: 'string',
  })
}

export const handler = args => {
  console.log('args', args)

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

    const name = process.env.GIT_AUTHOR_NAME || args.user.name
    const email = process.env.GIT_AUTHOR_EMAIL || args.user.email

    console.log({ name, email })

    /*
     * author = Author.new(name, email, Time.now)
     * message = $stdin
     */

    /*
     * const author = new Author(name, email, Date.now())
     * const commit = new Commit(tree.oid, author, message)
     */

    // db.store(commit)

    console.log('tree', tree.oid)
    process.exit(0)
  } catch (error) {
    console.error(error)

    process.exit(1)
  }
}
