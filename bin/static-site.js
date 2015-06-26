#!/usr/bin/env node
var staticSite = require('../')
var color = require('cli-color')
var path = require('path')
var util = require('util')
var yargs = require('yargs')
  .usage('Usage: $0 [options]')
  .options({
    'b': {
      alias: 'build',
      type: 'string',
      describe: 'Path to build folder'
    },
    's': {
      alias: 'source',
      type: 'string',
      describe: 'Path to source folder'
    },
    'f': {
      alias: 'files',
      type: 'array',
      describe: 'Array of file extensions to compile'
    },
    'i': {
      alias: 'ignore',
      type: 'array',
      describe: 'Array of paths in source folder to ignore'
    },
    'h': {
      alias: 'helpers',
      type: 'array',
      describe: 'Array of site helpers to run'
    },
    't': {
      alias: 'templateEngine',
      type: 'string',
      describe: 'Template engine to use'
    },
    'v': {
      alias: 'verbose',
      type: 'boolean',
      describe: 'Enable verbose logging'
    }
  })
  .help('help')
  .version(require(__dirname + '/../package.json').version + '\n')
  .argv

function green (message) {
  console.log(color.green(message))
}

function indent (message) {
  console.log('  ' + message)
}

var blacklist = ['_', '$0', 'v', 'verbose', 'help', 'version', 's', 'b', 'f', 't', 'h', 'i']
var options = {}

Object.keys(yargs).forEach(function (option) {
  if (yargs[option] !== 'undefined' && blacklist.indexOf(option) === -1) {
    options[option] = yargs[option]
  }
})

staticSite(options, function (err, stats) {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  if (yargs.verbose) {
    green('Built the following pages:')
    var buildPath = path.join(process.cwd(), stats.build)
    stats.pages.forEach(function (page) {
      page = page.replace(buildPath, '')
      indent(page)
    })
    green('Source Folder:')
    indent(stats.source)
    green('Build Folder:')
    indent(buildPath)
  }

  var message = util.format('Built %s files in %sms', stats.pages.length, stats.duration)
  green(message)
  process.exit(0)
})
