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
    constructor(modules = {}) {
        debug('construct');
        this.modules = modules;
    }
    async load(directoryPath = '') {
        debug(`load ${directoryPath}`);
        const directory = await loadDirectory(directoryPath);
        Object.assign(this.modules, directory.toObject());
        misc.object.each(this.modules, (filePath, key, ...superKeys) => {
            registerModule(this.modules, filePath, key, ...superKeys);
        });
    }
}

/**
 * Load a directory with DirectoryFiles
 * @param directoryPath   If it's a relative path, it will be considered as relative to the path of
 *                        process.mainModule
 * @return directory      It's an instance of DirectoryFiles
 **/
async function loadDirectory(directoryPath) {
    directoryPath = misc.path.absolute(directoryPath);

    debug(`load ${directoryPath}`);
    const name = path.relative(misc.path.root, directoryPath);
    assert(!name.startsWith('.'), `Can not access directory at ${directoryPath}`);

    let directory = new DirectoryFiles();
    await directory.load(name);

    directory = directory
        .filter(filePath => ['.js', '.node', '.json'].includes(path.extname(filePath)))
        .mapKeys(key => path.basename(key, path.extname(key)));

    return directory;
}

/**
 * Register a module
 **/
function registerModule(object, filePath, key, ...superKeys) {
    superKeys = superKeys.reverse();

    let pointer = misc.object.getByKeys(object, ...superKeys);
    assert(pointer !== undefined, 'Autoloader.modules seems has been modified unexpectedly');

    debug(`register ${filePath}`);
    Object.assign(pointer, {
        get [key]() {
            return require(filePath);
        },
    });
}

module.exports = AutoLoader;
