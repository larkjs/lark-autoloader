# lark-autoloader
A module autoloader for lark apps

```

const autoloader = new AutoLoader();
await autoloader.load('lib');
const $ = autoloader.modules;

$.lib.Utils.toolA(); // equals to require('approot/lib/Utils').toolA;

```
