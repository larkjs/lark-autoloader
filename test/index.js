'use strict';

const example     = require('lark-autoloader/example');
const path        = require('path');
const AutoLoader  = require('lark-autoloader')

describe('auto loader', () => {
    before(async () => {
        await example();
    });

    it('should be accessible', async () => {
        $.models.api.Logic.should.be.an.instanceof(Function);
        $.models.api.Logic().should.be.exactly("Logic");
        $.lib.Utils.should.be.an.instanceof(Object);
        $.lib.Utils.toolA.should.be.an.instanceof(Function);
        $.lib.Utils.toolB.should.be.an.instanceof(Function);
        $.lib.Utils.toolA().should.be.exactly("A");
        $.lib.Utils.toolB().should.be.exactly("B");
    });

    it('should be ok create a autoloaer', async () => {
        const auto = new AutoLoader();
        await auto.load(path.join(__dirname, '../example/lib'));
        auto.modules.Utils.should.be.ok;
    });
});
