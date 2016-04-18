/** @summary: Submits the parent form of a text input if value of the input is changed.
    @example: <form> <input type="text" submit-on-change="500" /> <input type="submit" /> </form>
    @description: Form needs to have some kind of submit button. Value of the attribute specifies
    the rate at wich script will poll for changes.*/
(function submitOnChangeIIFE() { /*globals $registerBehavior*/
    'use strict';

    ({
        name: 'submit-on-change',
        registeredTag: 'submit-on-change-registered',
        pollRate: 1000, //ms
        document: document,

        init: function init() {
            if (typeof $registerBehavior === 'function') {
                $registerBehavior(this);
            }
            this.scan();
        },

        scan: function scan() {
            Array.prototype.slice.call(
                this.document.querySelectorAll('[' + this.name + ']:not([submit-on-change-processed])')
            ).forEach(this.registerInput, this);

            setTimeout(scan.bind(this), this.pollRate);
        },

        registerInput: function registerInput(input) {
            var reactionTimeString = input.getAttribute(this.name),
                reactionTime = parseInt(reactionTimeString) || this.pollRate;

            input.setAttribute('submit-on-change-processed', '');
            this.checkForChanges(input, input.value, reactionTime);
        },

        checkForChanges: function checkForChanges(input, lastValue, reactionTime) {
            var nextInvocation = this.checkForChanges.bind(this, input, input.value, reactionTime);
            if (lastValue !== input.value) {
                input.form.querySelector('input[type=submit],button[type=submit]').click(); //this is how forms work, even if you press Enter to submit
                input.focus(); //the line above will take away the focus
            }
            setTimeout(nextInvocation, reactionTime);
        }
    }).init();

}());
