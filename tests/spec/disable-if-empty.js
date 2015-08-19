describe('disable-if-empty ', function() { /*globals behaviors, makePage*/
    'use strict';

    var module;

    beforeEach(function() {
        module = Object.create(behaviors['disable-if-empty']);
    });

    it('disables the control when field is empty', function() {
        module.document = makePage(
            '<input type="text" id="x" />' +
            '<button disable-if-empty="#x"></button>'
        );

        module.processAll();

        var button = module.document.querySelector('button');
        expect(button.disabled).toBe(true);
    });

    it('enables the control when field has a value', function() {
        module.document = makePage(
            '<input type="text" id="x" value="test" />' +
            '<button disable-if-empty="#x"></button>'
        );

        module.processAll();

        var button = module.document.querySelector('button');
        expect(button.disabled).toBe(false);
    });

    it('works with dropdowns', function() {
        module.document = makePage(
            '<select id="x">'+
            '<option value="something"></option>'+
            '<option value="" selected></option>'+
            '</select>' +
            '<button disable-if-empty="#x"></button>'
        );

        module.processAll();

        var button = module.document.querySelector('button');
        expect(button.disabled).toBe(true);
    });
});
