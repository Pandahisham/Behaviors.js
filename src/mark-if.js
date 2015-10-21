/** @summary: Sets an attribute of the element if supplied CSS selector matches something.
    @example: <a id="target" href="">hover over</a> <span mark-if-if="#target:hover">something</span>
    // Span element will recieve `mark-if` attribute, which will be set to "true" when
    // user moves mouse pointer over the link. */
(function setMarkerIIFE() { /*globals $registerBehavior*/
    'use strict';

    ({
        name: 'mark-if',
        stateAttribute: 'mark-if-state',
        pollRate: 100, //ms
        document: document,

        init: function init(){
            if (typeof $registerBehavior === 'function') {
                $registerBehavior(this);
            }
            this.scan();
        },

        scan: function scan(){
            Array.prototype.slice.call(
                this.document.querySelectorAll('[' + this.name + ']')
            ).forEach(this.update, this);

            setTimeout(scan.bind(this), this.pollRate);
        },

        update: function update(target){
            var selector = target.getAttribute(this.name),
                matchedSomething = this.document.querySelector(selector) !== null;
            if (target.getAttribute(this.stateAttribute) !== matchedSomething.toString()) { //only update when change is necessary
                target.setAttribute(this.stateAttribute, matchedSomething);
            }
        }
    }).init();
}());
