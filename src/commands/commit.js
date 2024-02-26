import path from 'node:path'
import {
  Workspace,
  Database,
  Blob,
  Tree,
  Entry,
  Author,
  Commit,
  Refs,
} from '../database/index.js'
import { getTimestampWithOffset } from '../utils/date.js'

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
  const currentPath = process.cwd()
  const gitPath = path.resolve(currentPath, '.git')
  const dbPath = path.join(gitPath, 'objects')

  const workspace = new Workspace(currentPath)
  const db = new Database(dbPath)
  const refs = new Refs(gitPath)

  try {
    const files = workspace.listFiles()

    const blobs = files.map(file => {
      const fileData = workspace.readFile(file)
      const blob = new Blob(fileData)

      return { file, blob }
    })

    /*
     * Store each file
     * DB store assignes oid
     */
    blobs.forEach(({ blob }) => db.store(blob))

    /* Store tree  */
    const entries = blobs.map(({ file, blob }) => new Entry(file, blob.oid))
    const tree = new Tree(entries)
    const treeOid = db.store(tree)

    /* Store commit info */
    const name = process.env.GIT_AUTHOR_NAME || args.user.name
    const email = process.env.GIT_AUTHOR_EMAIL || args.user.email
    const author = new Author(name, email, getTimestampWithOffset())
    const parent = refs.readHead()
    const commit = new Commit(parent, treeOid, author, args.m)
    const commitOid = db.store(commit)

    refs.updateHead(commitOid)

    console.log(
      `[ ${parent ? '' : 'root'} ${commitOid} ] ${args.m.split('\n')[0]}`
    )

    process.exit(0)
  } catch (error) {
    console.error(error)

    process.exit(1)
  }
}
