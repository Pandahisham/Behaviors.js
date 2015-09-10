describe('splice-into ', function() { /*globals behaviors, makePage, make, doNothing*/
    'use strict';

    var module;

    beforeEach(function() {
        module = Object.create(behaviors['splice-into']);
    });

    it('checks splicer forms', function() {
        module.document = makePage(
            '<form></form>' + //should be ignored
            '<form splice-into="" splice-into-registered></form>' + //should be ignored as well
            '<form id="targeted" splice-into=""></form>'
        );
        module.trackForm = jasmine.createSpy('trackFormFake');

        module.scanDocument();

        var target = module.document.querySelector('#targeted');
        expect(module.trackForm).toHaveBeenCalledWith(target, 0, jasmine.any(Array));
    });

    it('checks splicer links', function() {
        module.document = makePage(
            '<a></a>' + //should be ignored
            '<a splice-into="" splice-into-registered></a>' + //should be ignored as well
            '<a id="targeted" splice-into=""></a>'
        );
        module.trackLink = jasmine.createSpy('trackLinkFake');

        module.scanDocument();

        var target = module.document.querySelector('#targeted');
        expect(module.trackLink).toHaveBeenCalledWith(target, 0, jasmine.any(Array));
    });

    it('registers tracked forms', function() {
        var form = make('<form></form>');

        module.trackForm(form);

        expect(form.hasAttribute(module.registered)).toBe(true);
    });

    it('registers tracked links', function() {
        var link = make('<a></a>');

        module.trackForm(link);

        expect(link.hasAttribute(module.registered)).toBe(true);
    });

    it('processes form submits', function() {
        var form = {
            addEventListener: jasmine.createSpy('addEventListenerFake'),
            querySelectorAll: function() {
                return [];
            },
            setAttribute: doNothing,
        };

        module.trackForm(form);

        expect(form.addEventListener).toHaveBeenCalledWith('submit', jasmine.any(Function));
    });

    it('processes link click', function() {
        var link = {
            addEventListener: jasmine.createSpy('addEventListenerFake'),
            setAttribute: doNothing,
        };

        module.trackLink(link);

        expect(link.addEventListener).toHaveBeenCalledWith('click', jasmine.any(Function));
    });

    it('sets loading attrs', function() {
        var page = makePage(
            '<form action="." method="post" splice-into="#target"></form>' +
            '<div id="target"></div>'
        );
        module.document = page;
        module.loadPage = doNothing;
        var form = page.querySelector('form');

        module.processFormSubmit({
            target: form,
            preventDefault: doNothing
        });

        var target = page.querySelector('#target');
        expect(target.hasAttribute(module.loading)).toBe(true);
    });

    it('respects override attribute on buttons', function() {
        var page = makePage(
            '<form splice-into="#target">' +
            '<button splice-into-disabled></button>' +
            '</form>'
        );
        module.loadPage = jasmine.createSpy('fakeLoadPage');
        module.submittingButton = page.querySelector('button');
        var form = page.querySelector('form');
        var fakePreventDefault = jasmine.createSpy('preventDefaultFake');

        module.processFormSubmit({
            target: form,
            preventDefault: fakePreventDefault
        });

        expect(fakePreventDefault).not.toHaveBeenCalled();
        expect(module.loadPage).not.toHaveBeenCalled();
    });

    it('targets specified page', function() {
        var page = makePage(
            '<form splice-into="#target" method="post" action="http://example.com">' +
            '<input name="x" value="y" />' +
            '</form>' +
            '<div id="target"></div>'
        );
        module.loadPage = jasmine.createSpy('fakeLoadPage');
        var form = page.querySelector('form');

        module.processFormSubmit({
            target: form,
            preventDefault: doNothing
        });

        expect(module.loadPage).toHaveBeenCalledWith('post', 'http://example.com/?x=y', jasmine.any(Function));
    });

    it('serializes and concatenates named inputs', function() {
        var form = makeForm(
            '<input name="a" value="x"/>' +
            '<input type="text" name="b" value="y"/>' +
            '<input value="c" />'
        );

        var result = module.serializeForm(form);

        expect(result).toBe('a=x&b=y');
    });

    it('serializes checked checkboxes', function() {
        var form = makeForm( //upper case in type is intentional
            '<input type="CHECKBOX" name="checkbox1" value="a" />' +
            '<input type="CHECKBOX" name="checkbox2" value="b" checked/>'
        );

        var result = module.serializeForm(form);

        expect(result).toBe('checkbox2=b');
    });

    it('serializes radio button group', function() {
        var form = makeForm( //upper case in type is intentional
            '<input type="RADIO" name="x" value="a"/>' +
            '<input type="RADIO" name="x" value="b" checked/>'
        );

        var result = module.serializeForm(form);

        expect(result).toBe('x=b');
    });

    it('serializes dropdowns', function() {
        var form = makeForm(
            '<select name="dropdown">' +
            '<option value="a"><option>' +
            '<option value="b" selected><option>' +
            '</select>'
        );

        var result = module.serializeForm(form);

        expect(result).toBe('dropdown=b');
    });

    it('serializes text areas', function() {
        var form = makeForm('<textarea name="multiline">a b\nc</textarea>');

        var result = module.serializeForm(form);

        expect(result).toBe('multiline=a+b%0Ac');
    });

    it('serializes hidden fields', function() {
        var form = makeForm('<input type="HIDDEN" name="hiding" value="a" />'); //upper case in type is intentional

        var result = module.serializeForm(form);

        expect(result).toBe('hiding=a');
    });

    it('captures submitting button', function() {
        var form = makeForm( //upper case in type is intentional
            '<button type="SUBMIT" name="notSubmitter" value="a"></button>' +
            '<button type="SUBMIT" name="submitter" value="b"></button>'
        );
        var button = form.querySelector('[name=submitter]');
        module.captureSubmitter({
            target: button
        });

        var result = module.serializeForm(form);

        expect(result).toBe('submitter=b');
    });

    it('composes URLs semantically', function() {
        var result = module.composeURL('http://example.com/?x=y', 'a=b');

        expect(result).toBe('http://example.com/?a=b');
    });

    it('replaces elements', function() {
        var page = makePage('<div id="target">original</div>');
        var nextPage = makePage('<div id="target">replaced</div>');
        var targetElement = page.querySelector('#target');

        module.replaceWithTwin(nextPage, targetElement);

        var result = page.querySelector('#target').innerHTML;
        expect(result).toBe('replaced');
    });

    it('parses page', function() {
        var html = '<html><body><div id="target"></div></body></html>';

        var page = module.parsePage(html);

        var testElement = page.querySelector('#target');
        expect(testElement).not.toBe(null);
    });
});
