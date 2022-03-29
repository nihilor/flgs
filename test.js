#!/usr/bin/env node

const FFM = require('./feature-flagging.js')
let ffm =   new FFM()

if (ffm.isSet('blue')) {
    //  new behaviour
    console.log("I'm blue, dabadi, dabada!")
}
else {
    //  old behaviour
}
