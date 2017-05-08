function doNothing() {}

function returnsZero() {
    return 0;
}

function make(html) {
    var newDocument = document.implementation.createHTMLDocument('title');
    newDocument.body.innerHTML = html;

    if (newDocument.body.children.length !== 1) {
        throw "make() must be invoked with code tha generates a single tag.";
    }
    return newDocument.body.children[0];
}

function makePage(html) {
    var newDocument = document.implementation.createHTMLDocument('title');
    newDocument.body.innerHTML = html;
    return newDocument;
}

function makeForm(html) {
    var newDocument = document.implementation.createHTMLDocument('title');
    newDocument.body.innerHTML = '<form>' + html + '</form>';
    return  newDocument.body.querySelector('form');
}

var setTimeout = doNothing;

var behaviors = {};

function $registerBehavior(intercepted) {
    intercepted.run = doNothing; //stop module from running on a timer
    intercepted.document = makePage(''); //just a default to stop tthe module from messing with the current document
    behaviors[intercepted.name] = intercepted;
}