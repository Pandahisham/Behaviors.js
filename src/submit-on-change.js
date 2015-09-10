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
            this.run();
        },

        run: function run() {
            this.scan();
            setTimeout(this.run.bind(this), this.pollRate);
        },

        scan: function scan() {
            Array.prototype.slice.call(
                this.document.querySelectorAll('[' + this.name + ']:not([submit-on-change-processed])')
            ).foreach(this.process, this);
        },

        process: function process(input) {
            input.setAttribute('submit-on-change-processed', '');

            var reactionTimeString = input.getAttribute(this.name),
                reactionTime = parseInt(reactionTimeString) || 1000;

            this.checkForChanges(input, input.value, reactionTime);
        },

        checkForChanges: function checkForChanges(input, lastValue, reactionTime){
            if (input.value !== lastValue) {
                var submitter = input.form.querySelector('input[type=submit],button[type=submit]');
                submitter.click(); //this is how forms work, even if you use Enter to submit
                input.focus();
            } else {
                setTimeout(this.checkForChanges.bind(input, input.value, reactionTime), reactionTime);
            }
        }
    }).init();

}());
