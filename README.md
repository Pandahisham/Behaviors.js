Behaviors.JS
============

JavaScript libraries that are configured by adding tags and attributes to HTML. The libraries follows the principle of progressive enhancement and have no external dependencies.

Compatibility target: IE9+. Will fall back to default behavior on older browsers.

Examples
--------

###splice-into

Submits forms via AJAX and applies selected updates to the current page.

    <form action="/whatever/page" splice-into="#placeholder">
    <!-- ... -->
    </form>

    <div id="placeholder">
    <!-- this will be updated when you submit the form -->
    </div>

###characters-left

Counts characters remaining in a particular text field or textarea. Uses length from either max-length or data-val-length-max attributes on the target field.

    <textarea id="field-id"></textarea>
    <characters-left in="field-id" />

###include-on-proximity

Infinite scroller. Inlines target of a link when you scroll close to the said link.

    <div id="countainer-needs-id">
        <!-- page content... -->
        <a href="/page/2" include-on-proximity>Next Page</a>
    </div>

Infinite scroller. Inlines target of a link when you scroll close to the said link.

###mark-if

Puts `mark-if` attribute on the containing element. The attribute will have the value "true" as long as specified CSS selector matches something. It will contain "false" in the opposite case.

    <input type="checkbox" id="target"/>
    <div mark-if-if="#target:checked">Some Text</div>

When `#target` is checked the DOM will look as follows:

    <div mark-if="true" mark-if-if="[name=x]:checked">Some text.</div>

###disable-if-empty

Disables the control it is applied to if any of the targeted inputs are empty.

    <input type="text" id="x" />
    <button type="submit" disable-if-empty="#x">Go</button>
