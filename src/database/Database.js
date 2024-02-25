import { createHash } from 'node:crypto'
import path from 'node:path'
import fs from 'node:fs'
import zlib from 'node:zlib'
import { Buffer } from 'node:buffer'
import { generateRandomName } from '../utils/common.js'

export class Database {
  constructor(pathname) {
    this.pathname = pathname
  }

  store(object) {
    const buffer = Buffer.from(object.toString(), 'binary')

    /*
     * Prefix the resulting string with the object’s type, a space, the length of the string, and a null byte
     *
     * A null byte, also known as the null character or binary NUL,
     * is a character with the value zero (0).
     * It is often used as a terminator in C-style strings to mark the end of the string.
     * In the context of Git object storage, the null byte is used
     * as a delimiter between metadata (such as object type and size) and the content of the object.
     */
    const content = `${object.type} ${buffer.length}\0`
    const combinedBuffer = Buffer.concat([
      Buffer.from(content, 'binary'),
      buffer,
    ])

    // Hash using SHA-1 to compute the object’s ID,
    object.oid = createHash('sha1').update(combinedBuffer).digest('hex')

    this.writeObject(object.oid, combinedBuffer)

    return object.oid
  }

  // Compress and write to disk.
  writeObject(oid, content) {
    /*
     * build the final destination path that the blob will be written to
     * the path to the .git/objects directory +
     * the first two characters of the object ID + the remaining characters.
     * E.g. /Users/staneque/jit/.git/objects/90/3a71ad300d5aa1ba0c0495ce9341f42e3fcd7c
     */
    const objectPath = path.join(
      this.pathname,
      oid.substring(0, 2),
      oid.substring(2)
    )

    /*
     * If some other process attempts to read the file,
     * it might see a partially-written blob.
     * So write a file out to a temporary location,
     * and move it to its final destination.
     */
    const dirname = path.dirname(objectPath)
    const tempPath = path.join(dirname, generateRandomName(6, 'tmp_obj_'))

    try {
      fs.mkdirSync(dirname, { recursive: true })
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err
      }
    }

    // Open the file for reading and writing. If the file already exists, the call will fail.
    const file = fs.openSync(tempPath, 'wx+')

    const compressed = zlib.deflateSync(content, {
      level: zlib.constants.Z_BEST_SPEED,
    })

    fs.writeSync(file, compressed)

    fs.closeSync(file)

    fs.renameSync(tempPath, objectPath)
  }
}
