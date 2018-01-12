/**
 * Lark-AutoLoader provides an easy and fast way to access
 * local modules, like $.lib.utils.time.format('...') instead of require('../../lib/utils/time').format;
 *
 * The auto-loader scans all files under a directory and loads them when required
 **/
'use strict';

const assert          = require('assert');
const debug           = require('debug')('lark-autoloader.index');
const misc            = require('vi-misc');
const path            = require('path');
const DirectoryFiles  = require('directoryfiles');

class AutoLoader {
    constructor(target = {}, process = null) {
        debug('construct');
        process = process || defaultProcess(target);
        assert(target instanceof Object, 'Invalid target, should be an object');
        assert(process instanceof Function, 'Invalid processor, should be a function');
        this.target = target;
        this.process = process;
    }
    async load(directoryPath = '') {
        debug(`load ${directoryPath}`);
        const directory = await loadDirectory(directoryPath);
        misc.object.each(directory, (filePath, ...reverseKeys) => {
            const keys = reverseKeys.reverse();
            this.process(filePath, keys);
        });
    }
}

/**
 * Load a directory with DirectoryFiles
 * @param directoryPath   If it's a relative path, it will be considered as relative to the path of
 *                        process.mainModule
 * @return directory      Directory files in a tree (object)
 **/
async function loadDirectory(directoryPath) {
    directoryPath = misc.path.absolute(directoryPath);

    debug(`load ${directoryPath}`);
    const name = path.relative(misc.path.root, directoryPath);
    assert(!name.startsWith('.'), `Can not access directory at ${directoryPath}`);

    let directory = new DirectoryFiles(name);
    await directory.ready();

    return directory.tree;
}


function defaultProcess(target) {
    function registerModule(filePath, keys) {
        let key = keys.pop();
        let pointer = misc.object.pointByKeys(target, true, ...keys);
        assert(pointer !== undefined, 'Autoloader.target seems has been modified unexpectedly');

        assert('string' === typeof key, 'Invalid key type, should be a string');

        let extname = path.extname(key).toLowerCase();
        if (!['.js', '.node', '.json'].includes(extname)) {
            return;
        }
        key = path.basename(key, extname);
        
        debug(`register ${filePath}`);
        pointer.__defineGetter__(key, () => {
            debug(`require ${filePath}`);
            return require(filePath);
        });
    }
    return registerModule;
}

module.exports = AutoLoader;
