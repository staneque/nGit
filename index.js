#! /usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { commands } from './src/commands/index.js'

yargs(hideBin(process.argv)).command(commands).parse()
