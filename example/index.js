/**
 * Example of Lark Auto Loader
 **/
process.mainModule = module;

const assert      = require('assert');
const AutoLoader  = require('lark-autoloader');

global.$ = {};
const $ = global.$;

async function main() {
    const autoloader = new AutoLoader($);
    await autoloader.load();
    assert($.lib.Utils.toolA() === 'A');
    assert($.lib.Utils.toolB() === 'B');
    assert($.models.Logic() === 'Logic');

    const autoloader2 = new AutoLoader();
    await autoloader2.load();
    const _ = autoloader2.modules;
    assert(_.lib.Utils.toolA() === 'A');
    assert(_.lib.Utils.toolB() === 'B');
    assert(_.models.Logic() === 'Logic');
}

module.exports = main;
