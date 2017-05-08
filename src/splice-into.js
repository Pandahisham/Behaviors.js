/** @summary: Declarative AJAX for HTML forms.
    @example: <form action="/whatever/page" splice-into="#placeholder">...</form> <div id="placeholder"></div>
    // When the above form is submitted, this library will load /whatever/page in the background and replace div
    // 'placeholder' with whatever has the same id on /whatever/page.
    @description: Works on multiple targets if the selector matches multiple elements. */
(function spliceIntoIIFE() { /*globals $registerBehavior*/
    'use strict';

    function toArray(x) { //aliasing for clarity and compactness
        return Array.prototype.slice.call(x);
    }

    var name = 'splice-into';

    ({
        name: name,
        registered: name + '-registered',
        selector: '[' + name + ']:not([' + name + '-registered])',
        loading: name + '-loading',
        loaded: name + '-loaded',
        disabledMarker: name + '-disabled',
        pollRate: 100, //ms

        submittingButton: null,
        document: document,

        init: function init() {
            if (typeof $registerBehavior === 'function') {
                $registerBehavior(this);
            }
            this.scan();
        },

        scan: function scan() {
            toArray(this.document.querySelectorAll('form' + this.selector))
                .forEach(this.trackForm, this);
            toArray(this.document.querySelectorAll('a' + this.selector))
                .forEach(this.trackLink, this);

            setTimeout(scan.bind(this), this.pollRate);
        },

        trackForm: function trackForm(form) {
            this.trackLastClickedButton(form);
            form.addEventListener('submit', this.processFormSubmit.bind(this));
            form.setAttribute(this.registered, '');
        },

        processFormSubmit: function processFormSubmit(event) {
            if (!!this.submittingButton && this.submittingButton.hasAttribute(this.disabledMarker)) {
                return; //normal form submit with no AJAX
            }
            event.preventDefault();

            var form = event.target,
                queryString = this.serializeForm(form),
                url = this.composeURL(form.action, queryString),
                targets = this.getTargetElements(form);

            this.splice(form.method, url, targets);
        },

        captureSubmitter: function captureSubmitter(event) {
            this.submittingButton = event.target;
        },

        trackLastClickedButton: function trackLastClickedButton(form) { //because clicked button's value gets added to query
            function addButtonListener(button) {
                button.addEventListener('click', this.captureSubmitter.bind(this));
            }

            toArray(form.querySelectorAll('button[type=submit]'))
                .forEach(addButtonListener, this);
        },

        trackLink: function trackLink(link) {
            link.addEventListener('click', this.processLinkClick.bind(this));
            link.setAttribute(this.registered, '');
        },

        processLinkClick: function processLinkClick(event) {
            event.preventDefault();

            var link = event.target,
                targets = this.getTargetElements(link);
            this.splice('GET', link.href, targets);
        },

        pageLoadHandler: function pageLoadHandler(targets, responseText) {
            var nextPage = this.parsePage(responseText);
            targets.forEach(this.replaceWithTwin.bind(this, nextPage));
        },

        getTargetElements: function getTargetElements(element) {
            var selector = element.getAttribute(this.name);
            return toArray(this.document.querySelectorAll(selector));
        },

        splice: function splice(method, url, targets) {
            var processPage = this.pageLoadHandler.bind(this, targets);

            targets.forEach(function setLoading(target) {
                target.setAttribute(this.loading, true);
            }, this);

            this.loadPage(method, url, processPage);
        },

        acceptField: function acceptField(field) {
            return !!field.name && //skip nameless fields
                (field.type !== 'checkbox' && field.type !== 'radio' || field.checked) && //skip unchecked readio buttons and checkboxes
                (field.tagName !== 'BUTTON' || field === this.submittingButton); //only keep button value if it submitted the form
        },

        serializeForm: function serializeForm(form) {
            return toArray(form.elements)
                .filter(this.acceptField, this)
                .map(function toString(element) {
                    return element.name + '=' + encodeURIComponent(element.value).replace(/%20/g, '+'); //replace significantly shortens natural language GET URLs
                })
                .join('&');
        },

        composeURL: function composeURL(url, queryString) {
            var urlElement = document.createElement('a');
            urlElement.href = (url === '' ? document.URL : url); //the conditional is a workaround for IE bug
            urlElement.search = queryString;
            return urlElement.href;
        },

        replaceWithTwin: function replaceWithTwin(pageWithReplacement, targetElement) {
            var twinElement = pageWithReplacement.querySelector('#' + targetElement.id);
            targetElement.removeAttribute(this.loading); //for CSS spinners

            if (!twinElement) {
                return;
            }

            twinElement.setAttribute(this.loaded, ''); //for CSS fade-in effects
            targetElement.parentNode.replaceChild(twinElement, targetElement); //also would work, but probably less efficient: targetElement.outerHTML = twinElement.outerHTML;
        },

        parsePage: function parsePage(htmlString) {
            var responsePage = document.createElement('buffer'); //this will create a new document, the name does not matter
            responsePage.innerHTML = htmlString;
            return responsePage;
        },

        loadPage: function loadPage(method, url, finished) {
            var request = new XMLHttpRequest();
            request.onload = function processResponse() {
                if (request.status !== 200 && request.status !== 304) {
                    return;
                }
                finished(request.responseText);
            };
            request.open(method, url, true);
            request.send();
        }
    }).init();
}());
