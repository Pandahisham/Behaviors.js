describe('mark-if ', function() { /*globals behaviors, makePage*/
    'use strict';

    var module;

    beforeEach(function() {
        module = Object.create(behaviors['mark-if']);
    });

    it('adds marker', function() {
        module.document = makePage(
            '<div id="x" mark-if="#y"></div>' +
            '<div id="y"></div>'
        );

        module.processAll();

        var activeElement = module.document.querySelector('#x');
        expect(activeElement.getAttribute('mark-if-state')).toBe('true');
    });

    it('has no false positives', function() {
        module.document = makePage('<div id="x" mark-if="#y"></div>');

        module.processAll();

        var activeElement = module.document.querySelector('#x');
        expect(activeElement.getAttribute('mark-if-state')).toBe('false');
    });
});
