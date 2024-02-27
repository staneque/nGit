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

export const handler = async args => {
  const currentPath = process.cwd()
  const gitPath = path.resolve(currentPath, '.git')
  const dbPath = path.join(gitPath, 'objects')

  const workspace = new Workspace(currentPath)
  const db = new Database(dbPath)
  const refs = new Refs(gitPath)

  try {
    const files = await workspace.listFiles()

    const filesDataPromises = files.map(fileName => {
      return Promise.all([
        Promise.resolve(fileName), // [0] File name
        workspace.readFile(fileName), // [1] File data
        workspace.getFileStats(fileName), // [2] File stat
      ])
    })

    const filesData = await Promise.all(filesDataPromises)

    const blobs = filesData.map(f => {
      const [fileName, fileData, fileStat] = f

      const blob = new Blob(fileData)

      return { blob, fileName, fileStat }
    })

    /*
     * Store each file
     * Mind that db.store produces side effect by assigning oid to the passed object.
     */
    await Promise.all[blobs.map(({ blob }) => db.store(blob))]

    /* Store tree  */
    const entries = blobs.map(
      ({ fileName, blob, fileStat }) => new Entry(fileName, blob.oid, fileStat)
    )
    const tree = new Tree(entries)
    const treeOid = await db.store(tree)

    /* Store commit info */
    const name = process.env.GIT_AUTHOR_NAME || args.user.name
    const email = process.env.GIT_AUTHOR_EMAIL || args.user.email
    const author = new Author(name, email, getTimestampWithOffset())
    const parent = refs.readHead()
    const commit = new Commit(parent, treeOid, author, args.m)
    const commitOid = await db.store(commit)

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
