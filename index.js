/**
 * Lark-AutoLoader provides an easy and fast way to access
 * local modules, like $.lib.utils.time.format('...') instead of require('../../lib/utils/time').format;
 *
 * The auto-loader scans all files under a directory and load them if required
 **/
'use strict';

const assert          = require('assert');
const debug           = require('debug')('lark-autoloader.index');
const misc            = require('vi-misc');
const path            = require('path');
const DirectoryFiles  = require('directoryfiles');

class AutoLoader {
    constructor(modules = {}) {
        this.modules = modules;
    }
    async load(directoryPath = '') {
        directoryPath = misc.path.absolute(directoryPath);
        debug(`load ${directoryPath}`);
        const name = path.relative(misc.path.root, directoryPath);
        assert(!name.startsWith('.'), `Can not access directory at ${directoryPath}`);
        const directory = new DirectoryFiles();
        await directory.load(name);
        const object = directory
            .filter(filePath => ['.js', '.node', '.json'].includes(path.extname(filePath)))
            .mapKeys(key => path.basename(key, path.extname(key)))
            .toObject();
        misc.object.each(object, (filePath, key, ...superKeys) => {
            let pointer = this.modules;
            for (const superKey of superKeys.reverse()) {
                pointer[superKey] = pointer[superKey] || {};
                pointer = pointer[superKey];
            }
            debug(`register ${filePath}`);
            Object.assign(pointer, {
                get [key]() {
                    return require(filePath);
                }
            });
        });
    }
}

module.exports = AutoLoader;
