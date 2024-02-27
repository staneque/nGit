import fs from 'node:fs'

export const fileExistsSync = filePath => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK)
    return true
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false
    }

    throw err
  }
}
