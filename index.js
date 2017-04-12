/**
 * Lark Auto Loader
 **/
const assert      = require('assert');
const fs          = require('fs');
const misc        = require('vi-misc');
const path        = require('path');

class AutoLoader {
    constructor (dirname = '') {
        assert('string' === typeof dirname, 'Dirname must be a string');
        dirname = misc.path.absolute(dirname);
        assert(fs.statSync(dirname).isDirectory(), 'Dirname must be a path of a DIRECTORY');

        const files = fs.readdirSync(dirname)
                        .filter(filename => !filename.startsWith('.'));

        for (let filename of files) {
            let name = path.basename(filename, path.extname(filename));
            const targetPath = path.join(dirname, filename);
            if (fs.statSync(targetPath).isDirectory()) {
                this[name] = new AutoLoader(targetPath);
            }
            else {
                this.__defineGetter__(name, () => require(targetPath));
            }
        }
    }
}

module.exports = AutoLoader;
