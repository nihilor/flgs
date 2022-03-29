#!/usr/bin/env node

const FFM = require('./flgs.js')
let ffm =   new FFM()

if (ffm.isSet('blue')) {
    //  new behaviour
    console.log("I'm blue, dabadi, dabada!")
}
else {
    //  old behaviour
}
