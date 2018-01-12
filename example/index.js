/**
 * Example of Lark Auto Loader
 **/
process.mainModule = module;

const assert      = require('assert');
const path        = require('path');
const AutoLoader  = require('lark-autoloader');

global.$ = {};
const $ = global.$;

async function main() {
    const autoloader = new AutoLoader($);
    await autoloader.load();
    assert($.lib.Utils.toolA() === 'A');
    assert($.lib.Utils.toolB() === 'B');
    assert($.models.api.Logic() === 'Logic');
    assert($.models.data.Coke.name === 'coke');
    assert($.models.dao.Redis.redis=== 'redis');

    const autoloader2 = new AutoLoader();
    await autoloader2.load();
    const _ = autoloader2.target;
    assert(_.lib.Utils.toolA() === 'A');
    assert(_.lib.Utils.toolB() === 'B');
    assert(_.models.api.Logic() === 'Logic');
    assert(_.models.data.Coke.name === 'coke');
    assert(_.models.dao.Redis.redis=== 'redis');
}

// main().catch(e => console.log(e));
module.exports = main;
