# lark-autoloader
A module autoloader for lark apps

```

const autoloader = new AutoLoader();
await autoloader.load('lib');
const $ = autoloader.target;

$.lib.Utils.toolA(); // equals to require('approot/lib/Utils').toolA;

```

# Customize

```
const autoloader = new Autoloader(container, (filePath, keys) => {
    container[keys.join('/')] = filePath;
});
await autoloader.load('xxx');
```
