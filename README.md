Behaviors.JS
============

Behaviors are JavaScript libraries that can be used without writing any code. That is, they are configured via HTML tags or attributes on the client side and they do not require any structural changes on the server side. Each library is self-contained and has no external dependencies.

Compatibility target: IE9+. Should fall back to default HTML behavior in older browsers.

##splice-into

Declarative AJAX library that can be applied to vanilla forms and links without writing any code. The only thing you need to specify is which parts of the current page need to be replaced. The library works by fetching the target page and splicing those elements in (provided that they have consistent IDs).

With links:

    <a href="/whatever/page" splice-into="#here">link</a>

    <div id="here">
        <!-- this will be updated when you click the link -->
    </div>

With forms:

    <form action="/whatever/page" splice-into="#here">
        <!-- ... -->
    </form>

    <span id="here"><!-- this will be updated when you submit the form --></span>

##characters-left

Counts characters remaining in a text field or textarea. Uses max-length or data-val-length-max to get the character limit.

    <textarea id="field-id"></textarea>
    <characters-left in="field-id"></sharacters-left>

##include-on-proximity

Infinite scroller. When the user scrolls close to the "next page" link the library inlines that page into the current container.

    <div id="container-needs-id">
        <!-- page content... -->
        <a href="/page/2" include-on-proximity>Next Page</a>
    </div>

Infinite scroller. Inlines target of a link when you scroll close to it.

##mark-if

Library for conditional styling. It keeps track of whether a certain condition is met and sets an attribute on the current tag to either "true" or "false". The condition is expressed as a CSS query - it's true if the query matches at least one element.

Usage:

    <input type="checkbox" id="target"/>
    <div mark-if="#target:checked">Some Text</div>

DOM values when `#target` is checked:

    <div mark-if="#target:checked" mark-if-state="true">Some text.</div>

DOM values when `#target` is not checked:

    <div mark-if="#target:checked" mark-if-state="false">Some text.</div>

##disable-if

Disables the control if query matches anything.

    <input type="text" id="x" required />
    <button type="submit" disable-if="#x:invalid">Go</button>

##submit-on-change

Submits the parent form of the input field if field's value is changed. The form needs to have a submit button for the script to work properly.

    <form action="/some/page">
        <input type="text" submit-on-change />
        <button type="submit"></button>
    </form>

Optionally, you can specify poll rate as the value of the parameter (`submit-on-change="200"`).

##toggle-on-click

Toggles `toggle-on-click-active` attribute when the element is clicked. Adds `toggle-on-click-loaded` to the root html element to allow progressive styling.

<div toggle-on-click>Content</div>