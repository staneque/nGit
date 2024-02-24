export const command = 'com [-m] <msg>'
export const desc = 'Create a commit'

export const builder = (yargs) => {
  yargs.positional('m', {
    describe: 'URL to fetch content from',
    type: 'string',
    default: 'http://www.google.com'
  }).positional('proxy', {
    describe: 'optional proxy URL'
  })

//   yargs.command('get <source> [proxy]', 'make a get HTTP request', (yargs) => {
//   yargs.positional('source', {
//     describe: 'URL to fetch content from',
//     type: 'string',
//     default: 'http://www.google.com'
//   }).positional('proxy', {
//     describe: 'optional proxy URL'
//   })
// })
// .help()
// .parse()