# Feature Flag Manager

Enables simple feature flagging by incorporating different ways to toggle features.

## Why?

1. Quickly enable and disable features in a project.
2. Provide simplest A/B testing.
3. Create staging, test and production environments.
4. Converts to clear pure boolean.
5. Enables continuity.
6. Enables Gitops.
7. Enables `package.json` branching.

## What?

FFM ist a simple feature flagging manager. It looks up different places for specific configurations and imports them. Possible options are:

* package.json
* features.json
* command line parameters
* global array
* class contructor

The order of priorization is `package > features > cli > global > constructor`.

Regard: A flag is set or unset. Because of this maxime FFM converts all values to either `true` or `false` based on an own strategy:

* `true`, `1`, `"1"`, `"on"`, `"yes"`, `"enable"` will be interpreted as `set`
* a `function` or an `object` as a value for a flag, even if the are empty, will be interpreted as `set`
* `null` will be interpreted as `false`
* all other values and types will be interpreted as `false`

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
let ffm = new FFM({
    "bluecolors": true
})
```

## How?

First, install the package via NPM.

```sh
npm install --save ffm
```

Second, import the package and instantiate FFM.

```js
const FFM = require('ffm')
let ffm =   new FFM()
```

Third, use it in a simple `if` clause:

```js
if (ffm.isSet('bluecolors')) {
    //  new behaviour
}
else {
    //  old behaviour
}
```
