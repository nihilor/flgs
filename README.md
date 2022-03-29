# flgs - The Feature Flag Manager for Node and Javascript

Enables simple feature flagging, feature gating and co. by incorporating different stages to toggle features.

## Why?

1. Quickly enable and disable features in a project.
2. Provide simplest A/B testing.
3. Create staging, test and production environments.
4. Converts to clear pure boolean.
5. Enables continuity.
6. Enables Gitops.
7. Enables `package.json` branching.

## What?

**flgs** is a simple feature flagging manager. It looks up different places for specific configurations and imports them. Possible options are:

* package.json
* features.json
* command line parameters
* global array
* class contructor

The order of priorization is `package > features > cli > global > constructor`.

Regard: A flag is set or unset. Because of this maxime **flgs** converts all values to either `true` or `false` based on an own strategy:

* `true`, `"true"`, `1`, `"1"`, `"on"`, `"yes"`, `"enable"` will be interpreted as `set`
* a `function` or an `object` as a value for a flag, even if the are empty, will be interpreted as `set`
* `null` will be interpreted as `unset`
* all other values and types will be interpreted as `unset`

## How?

First, install the package via NPM.

```sh
$ npm install --save ffm
```

Second, import the package and instantiate FFM.

```js
const Flgs = require('flgs')
let flgs = new Flgs()
```

Third, use it in a simple `if` clause:

```js
if (flgs.isSet('bluecolors')) {
    //  new behaviour
}
else {
    //  old behaviour
}
```

An example for `package.json` located in the root of the importing project:

```json
{
  ...
  "featureflags": {
    "bluecolors": true,
    "redcolors": false,
    "greencolors": false,
    "violetcolors": {},
    "orangecolors": [
      "a",
      "b"
    ]
  }
  ...
}
```

An example for `featureflags.json` located in the root of the importing project:

```json
{
    "greencolors": false,
    "redcolors": true,
    "bluecolors": true,
    "violetcolors": false,
    "orangecolors": false
}
```

An example for the command line interface, provided via `package.json` in the root of the importing project. The cli argument must start with `FFM_`:

```json
{
  ...
  "scripts": {
    "flagging": "node index.js FFM_BLUECOLORS"
  }
  ...
}
```

An example for a global array:

```js
const _FMM = {
    "bluecolors": true
}
```

An example for a default configuration:

```js
let flgs = new Flgs({
    "bluecolors": true
})
```

License
-------

Copyright (c) 2022 Mark Lubkowitz (https://mlu.io/)

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
