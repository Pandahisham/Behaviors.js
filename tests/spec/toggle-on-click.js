describe('toggle-on-click', function() { /*globals behaviors, makePage */
    'use strict';

    var module;

    beforeEach(function() {
        module = Object.create(behaviors['toggle-on-click']);
    });

    var timedFunctions = [];

    it('toggles', function() {
        module.document = makePage(
            '<h2 toggle-on-click></h2>'
        );

        var targetElement = module.document.querySelector('h2');
        var fakeEvent = {
            target: targetElement
        };

        module.handleClick(fakeEvent);

        expect(targetElement.hasAttribute(module.activeAttribute)).toBe(true);
    });

    it('toggles back', function() {
        module.document = makePage(
            '<h2 toggle-on-click></h2>'
        );

        var targetElement = module.document.querySelector('h2');
        var fakeEvent = {
            target: targetElement
        };

        module.handleClick(fakeEvent);
        module.handleClick(fakeEvent);

        expect(targetElement.hasAttribute(module.activeAttribute)).toBe(false);
    });
    
    it('registers itself on init', function() {
        //init is triggered when the module is loaded, we just have to check the result of it running
        expect(module.document.querySelector('html['+module.loadedAttribute+']')).toBeTruthy();
    });
});
