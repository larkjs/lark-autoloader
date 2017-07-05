'use strict';

const example = require('../example/app');

describe('auto loader', () => {
    before(async () => {
        await example();
    });

    it('should be accessible', (done) => {
        $.models.Logic.should.be.an.instanceof(Function);
        $.models.Logic().should.be.exactly("Logic");
        $.lib.Utils.should.be.an.instanceof(Object);
        $.lib.Utils.toolA.should.be.an.instanceof(Function);
        $.lib.Utils.toolB.should.be.an.instanceof(Function);
        $.lib.Utils.toolA().should.be.exactly("A");
        $.lib.Utils.toolB().should.be.exactly("B");
        done();
    });
});
