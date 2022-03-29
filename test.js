#!/usr/bin/env node

const Flgs = require('./flgs.js')
let flgs =   new Flgs()

if (flgs.isSet('blue')) {
    //  new behaviour
    console.log("I'm blue, dabadi, dabada!")
}
else {
    //  old behaviour
}