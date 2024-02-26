import fs from 'node:fs'
import { replaceExt } from '../utils/path.js'

class MissingParent extends Error {}
class NoPermission extends Error {}
class StaleLock extends Error {}

export class LockFile {
  constructor(filePath) {
    this.filePath = filePath
    this.lockPath = replaceExt(filePath, '.lock')
    this.lock = null
  }

  /*
   * Let the caller attempt to acquire a lock for writing to the file, and tell whether they were successful
   * by attempting to open the .lock file with the "wx+" ensures that the file is opened for reading and writing,
   * that it is created if it does not exist, and that the attempt to open it will fail
   * if it already exists, preventing overwrites.
   * https://nodejs.org/api/fs.html#file-system-flags
   *
   * The first process to call this method will create the .lock file, and any other process
   * that tries to acquire this lock will fail to do so.
   * If this "open" call succeeds store the file handle in this.lock so we can write to it.
   *
   * Catch errors and convert them into custom errors to discriminate them from other low-level errors
   */
  holdForUpdate() {
    if (!this.lock) {
      try {
        this.lock = fs.openSync(this.lockPath, 'wx+')
      } catch (error) {
        console.error('ERROR', error)
        if (error.code === 'EEXIST') {
          return false

          /*
           * It might seem counterintuitive that an ENOENT error could occur because the flag wx+
           * is supposed to create the file if it doesn't exist.
           * However, there are scenarios where this error might still occur:
           *
           * - Race conditions: Even though the file is created if it doesn't exist,
           * there might be a very short window between checking for the existence and actually creating it.
           * During this window, if another process or thread deletes the file,
           * the attempt to open it with 'wx+' could still result in an ENOENT.
           *
           * - Symbolic links: If there's a symbolic link in the file path that's broken or points to a non-existent location,
           *  it can also result in an ENOENT error.
           */
        } else if (error.code === 'ENOENT') {
          throw new MissingParent(error.message)
        } else if (error.code === 'EACCES') {
          throw new NoPermission(error.message)
        } else {
          throw error
        }
      }
    }

    return true
  }

  #raiseOnStaleLock() {
    if (!this.lock) {
      throw new StaleLock(`Not holding lock on file: ${this.lockPath}`)
    }
  }

  write(data) {
    this.#raiseOnStaleLock()

    fs.writeSync(this.lock, data)
  }

  commit() {
    this.#raiseOnStaleLock()
    fs.closeSync(this.lock)
    fs.renameSync(this.lockPath, this.filePath)
    this.lock = null
  }
}
