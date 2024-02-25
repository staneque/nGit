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
import fs from 'node:fs'
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

// TODO: async where possible
export const handler = async args => {
  const currentPath = process.cwd()
  const gitPath = path.resolve(currentPath, '.git')
  const dbPath = path.join(gitPath, 'objects')

  const workspace = new Workspace(currentPath)
  const db = new Database(dbPath)
  const refs = new Refs(gitPath)

  try {
    const files = workspace.listFiles()

    const entries = files.map(file => {
      const fileData = workspace.readFile(file)
      const blob = new Blob(fileData)

      db.store(blob)

      return new Entry(file, blob.oid)
    })

    const parent = await refs.readHead()

    // https://git-scm.com/book/en/v2/Git-Internals-Environment-Variables
    const name = process.env.GIT_AUTHOR_NAME || args.user.name
    const email = process.env.GIT_AUTHOR_EMAIL || args.user.email
    const author = new Author(name, email, getTimestampWithOffset())

    const tree = new Tree(entries)
    db.store(tree)

    const commit = new Commit(parent, tree.oid, author, args.m)

    const commitOid = db.store(commit)
    refs.updateHead(commitOid)

    const headFilePath = path.join(gitPath, 'HEAD')

    fs.writeFileSync(headFilePath, commitOid, { flag: 'w' })

    console.log(
      `[${parent ? '' : 'root'} ${commitOid} ] ${args.m.split('\n')[0]}`
    )

    process.exit(0)
  } catch (error) {
    console.error(error)

    process.exit(1)
  }
}
