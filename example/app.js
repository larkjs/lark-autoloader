/**
 * Example of Lark Auto Loader
 **/
process.mainModule = module;

const AutoLoader  = require('..');

const $ = new AutoLoader();

$.models.Logic;

module.exports = $;
