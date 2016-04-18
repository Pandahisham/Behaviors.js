describe('submit-on-change ', function() { /*globals behaviors, makePage */
    'use strict';

    var module;

    beforeEach(function() {
        module = Object.create(behaviors['submit-on-change']);
    });

    var timedFunctions = [];

    setTimeout = function(target) {
        timedFunctions.push(target);
    };

    it('finds the right element', function() {
        module.document = makePage(
            '<input id="target" submit-on-change />' +
            '<input />'
        );

        module.scan();

        var markedElements = module.document.querySelectorAll('[submit-on-change-processed]');
        var arrayWithTargetElement = module.document.querySelectorAll('#target');
        expect(markedElements).toEqual(arrayWithTargetElement);
    });

    it('does not submit if value is unchanged', function() {
        var page = makePage(
            '<form>' +
            '<input submit-on-change />' +
            '<button type="submit"></button>' +
            '</form>'
        );
        var targetField = page.querySelector('[submit-on-change]');
        var formSubmiterClick = jasmine.createSpy('formSubmiterClick');
        page.querySelector('button').addEventListener('click', formSubmiterClick);

        module.registerInput(targetField);

        timedFunctions.pop().call();
        expect(formSubmiterClick).not.toHaveBeenCalled();
    });

    it('submits the form if value changed', function() {
        var page = makePage(
            '<form>' +
            '<input submit-on-change />' +
            '<button type="submit"></button>' +
            '</form>'
        );
        var targetField = page.querySelector('[submit-on-change]');
        var formSubmiterClick = jasmine.createSpy('formSubmiterClick');
        page.querySelector('button').addEventListener('click', formSubmiterClick);

        module.registerInput(targetField);

        targetField.value = 'different';
        timedFunctions.pop().call();
        expect(formSubmiterClick).toHaveBeenCalled();
    });
});
