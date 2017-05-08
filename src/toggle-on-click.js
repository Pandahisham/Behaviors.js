/** @summary: Adds and removes toggle-on-click-active attribute on click (similar to checkboxes).
    @example: <h2 toggle-on-click></h2> 
(function toggleOnClickIIFE() { /* global document, $registerBehavior */
    'use strict';

    ({
        name: 'toggle-on-click',
        activeAttribute: 'toggle-on-click-active',
        loadedAttribute: 'toggle-on-click-loaded',
        document: document,

        init: function init() {
            if (typeof $registerBehavior === 'function') {
                $registerBehavior(this);
            }
            this.document.querySelector('html').setAttribute(this.loadedAttribute, '');
            this.document.addEventListener('click', this.handleClick.bind(this));
        },

        handleClick: function handleClick(e) {
            var toggler = e.target;
            if (!toggler.hasAttribute(this.name)) {
                return;
            }
            this.toggleActiveState(toggler);
        },

        toggleActiveState: function toggleActiveState(toggler) {
            if (toggler.hasAttribute(this.activeAttribute)) {
                toggler.removeAttribute(this.activeAttribute);
            } else {
                toggler.setAttribute(this.activeAttribute, '');
            }
        },
    }).init();
})();
