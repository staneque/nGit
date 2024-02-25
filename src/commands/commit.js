import path from 'node:path'
import {
  Workspace,
  Database,
  Blob,
  Tree,
  Entry,
  Author,
  Commit,
} from '../modules/index.js'
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
export const handler = args => {
  // console.log('args', args)

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

    const name = process.env.GIT_AUTHOR_NAME || args.user.name
    const email = process.env.GIT_AUTHOR_EMAIL || args.user.email
    const author = new Author(name, email, getTimestampWithOffset())

    const tree = new Tree(entries)
    db.store(tree) // TODO: DB writes tree.oid here,
    // consider return oid from the store method explicitly, to pass it further for more clarity

    const commit = new Commit(tree.oid, author, args.m)

    db.store(commit)

    const headFilePath = path.join(gitPath, 'HEAD')

    fs.writeFileSync(headFilePath, commit.oid, { flag: 'w' })

    console.log(`[(root-commit) ${commit.oid}] ${args.m.split('\n')[0]}`)
    console.log('tree', tree.oid)

    process.exit(0)
  } catch (error) {
    console.error(error)

    process.exit(1)
  }
}
