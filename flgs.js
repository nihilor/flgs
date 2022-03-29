#!/usr/bin/env node

/*

flgs - Feature Flag Manager
Copyright (c) 2022 Mark Lubkowitz <me@mlu.io>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

const Fs = require('fs')

class Flgs {
    //  priorize from out to in
    order = [
        //  package.json
        'package',
        //  features.json
        'file',
        //  command line and environment parameters
        'cli',
        //  global configuration object in project
        'global',
        //  default values given while instantiating FFM
        'default'
    ]

    config = {
        'package':  {},
        'file':     {},
        'cli':      {},
        'global':   {},
        'default':  {},
        'combined': {}
    }

    //  convert values to boolean by strategy
    booleanize (val) {
        val = val == null ? false : val
        switch (typeof val) {
            case 'boolean':
                return val
            case 'string':
                switch (val) {
                    case 'true':
                    case 1:
                    case '1':
                    case 'on':
                    case 'yes':
                    case 'enable':
                        return true
                    case 'null':
                    default:
                        return false
                }
            case 'function':
            case 'object':
                return true
            default:
                return false
        }
    }

    //  sanitize and validate configuration
    sanitize (cfg = {}) {
        let keys =  Object.keys(cfg)
        let validated = {}
        for (let key of keys) {
            if (key.match(/^[a-zA-Z0-9\_\-\.]+$/)) {
                validated[key] = this.booleanize(cfg[key])
            }
        }
        return validated
    }

    //  import package configuration
    importPackage () {
        let packagecfg = require('./package.json')
        return (packagecfg.featureflags
            ? this.sanitize(packagecfg.featureflags)
            : {})
    }

    //  import file configuration
    importFile () {
        let featureflagsfilename = './featureflags.json'
        return (Fs.existsSync(featureflagsfilename)
            ? this.sanitize(require(featureflagsfilename))
            : {})
    }

    //  import cli configuration
    importCli () {
        let clicfg = process.argv.slice(2)
        let matched = {}
        for (let arg of clicfg) {
            let match = arg.match(/^FFM_([a-zA-Z0-9\_\-]+)[\=]?([a-zA-Z0-9\_\-]+)*$/)
            if (match)
                matched[match[1].toLowerCase()] = this.booleanize(match[2])
        }
        return this.sanitize(matched)
    }

    //  import global configuration
    importGlobal () {
        let globalcfg = (typeof _FMM !== 'undefined' ? _FFM : {})
        return (globalcfg
            ? this.sanitize(globalcfg)
            : {})
    }

    //  checks if the flag is set to true
    isSet (flag) {
        return this.config.combined[flag]
            ? this.config.combined[flag]
            : false
    }

    isset (flag) { return this.isSet(flag) }
    on (flag) { return this.isSet(flag) }

    constructor (cfg) {
        this.config.package =   this.importPackage()
        this.config.file =      this.importFile()
        this.config.cli =       this.importCli()
        this.config.global =    this.importGlobal()
        this.config.default =   this.sanitize(cfg)

        //  combine configuration
        for (let source of this.order.reverse())
            this.config.combined = Object.assign(this.config.combined, this.config[source])

        return this
    }
}

module.exports = Flgs