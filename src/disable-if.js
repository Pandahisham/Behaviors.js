/** @summary: Disables the current field if the query matches something.
    @example: <input name="x" required /> <button type="submit" disable-if="[name=x]:valid">Save</button> */
(function disableIfIIFE() { /*global $registerBehavior*/
    'use strict';

    ({
        name: 'disable-if',
        pollRate: 100, //ms
        document: document,

        init: function init() {
            if (typeof $registerBehavior === 'function') {
                $registerBehavior(this);
            }
            this.scan();
        },

        scan: function scan() {
            this.select('[' + this.name + ']')
                .forEach(this.update, this);

            setTimeout(scan.bind(this), this.pollRate);
        },

        select: function select(query) {
            return Array.prototype.slice.call(this.document.querySelectorAll(query));
        },

        update: function update(target) {
            var selector = target.getAttribute(this.name),
                shouldBeDisabled = !!this.document.querySelector(selector);

            if (shouldBeDisabled !== target.disabled) { //we don't want to update DOM unless necessary
                target.disabled = shouldBeDisabled;
            }
        }
    }).init();
}());
