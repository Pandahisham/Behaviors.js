/** @summary: Disables the current field if other fields specified via CSS query are empty.
    @example: <input name="x" /> <button type="submit" disable-if-empty="[name=x]">Save</button>
    @description: Can target text areas, text fields and select fields. */
(function disableIfEmptyIIFE() { /*global $registerBehavior*/
    'use strict';

    ({
        name: 'disable-if-empty',
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

        update: function update(target) {
            var selector = target.getAttribute(this.name),
                shouldBeDisabled = this.anyAreEmpty(selector);
            if (shouldBeDisabled !== target.disabled) {
                target.disabled = shouldBeDisabled; //disable if matched something
            }
        },

        anyAreEmpty: function anyAreEmpty(selector) {
            var fields = this.document.querySelectorAll(selector);
            return Array.prototype.slice.apply(fields)
                .some(function isEmpty(input) {
                    return !input.value;
                });
        }
    }).init();
}());
