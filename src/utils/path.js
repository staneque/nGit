import path from 'node:path'

export const replaceExt = (p, ext) => {
  if (typeof p !== 'string') {
    return p
  }

  if (p.length === 0) {
    return p
  }

  const nFileName = path.basename(p, path.extname(p)) + ext
  const nFilepath = path.join(path.dirname(p), nFileName)

  /*
   * Because `path.join` removes the head './' from the given path.
   * This removal can cause a problem when passing the result to `require` or
   * `import`.
   */
  if (startsWithSingleDot(p)) {
    return '.' + path.sep + nFilepath
  }

  return nFilepath
}

function startsWithSingleDot(fpath) {
  var first2chars = fpath.slice(0, 2)
  return first2chars === '.' + path.sep || first2chars === './'
}
