describe('disable-if ', function() { /*globals behaviors, makePage*/
    'use strict';

    var module;

    beforeEach(function() {
        module = Object.create(behaviors['disable-if']);
    });

    it('disables the control when field is invalid', function() {
        module.document = makePage(
            '<input type="text" id="x" required />' +
            '<button disable-if="#x:invalid"></button>'
        );

        module.scan();

        var button = module.document.querySelector('button');
        expect(button.disabled).toBe(true);
    });

    it('enables the control when field is valid', function() {
        module.document = makePage(
            '<input type="text" id="x" required value="something" />' +
            '<button disable-if="#x:invalid"></button>'
        );

        module.scan();

        var button = module.document.querySelector('button');
        expect(button.disabled).toBe(false);
    });

    it('works with dropdowns', function() {
        module.document = makePage(
            '<select id="x" required>'+
            '<option value="" ></option>'+
            '<option value="something" selected></option>'+
            '</select>' +
            '<button disable-if="#x option[selected][value=\'something\']"></button>'
        );

        module.scan();

        var button = module.document.querySelector('button');
        expect(button.disabled).toBe(true);
    });
});
