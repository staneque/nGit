#! /usr/bin/env node
import yargs from 'yargs'
import fs from 'node:fs'
import ini from 'ini'
import os from 'os'
import { hideBin } from 'yargs/helpers'
import { commands } from './src/commands/index.js'

// TODO: read local config
const globalGitConfigPath = os.homedir() + '/.gitconfig'

fs.readFile(globalGitConfigPath, 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading global Git configuration file:', err)
    return
  }

  const config = ini.parse(data)

  yargs(hideBin(process.argv)).config(config).command(commands).parse()
})
