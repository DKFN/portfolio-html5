var _rKrefs = 0;

const Komponent = Class.extend({
    propsBag: undefined, // Props of the component
    state: undefined, // State of the component
    childRef: undefined, // Ref to the child, filled when builded
    renderedDom: undefined, // Final DOM after call to child's render()
    childFirstRendered: undefined, // Lifecycle boolean, does the component created ?
    diffIdentifier: undefined, // Idenfier used on setState() to replace content
    renderMethod: { // Proprieties to be defined by the child component
        targetContainer: undefined,
        setHtml: false,
        appendHtml: false,
        customCallback: undefined,
    },

    /**
     * Constructor, lots of things happening here
     * @param childRef
     * @param propsBag
     * @param initState
     */
    init: function(childRef, propsBag = undefined, initState = undefined) {
        _rKrefs++;
        const mRef = _rKrefs;
        console.info("Komponent : Popping component #" + mRef);

        this.propsBag = propsBag;
        this.childRef = childRef;
        this.state = initState;
        this.diffIdentifier = "kompontent-differ-node-" + mRef;

        this.__render = this.__render.bind(this);
        this.__spawnChildComponent = this.__spawnChildComponent.bind(this);
        this.__eventsBinder = this.__eventsBinder.bind(this);
        this.__batchDiffRender = this.__batchDiffRender.bind(this);

        this.__render();
        console.info("Komponent : Popped #" + mRef + " (Differ full ID : " + this.diffIdentifier + " )");
    },

    /**
     * This function will seek for user defined callBacks and attach triggered events to it
     * @private
     */
    __eventsBinder: function() {
        $(document).ready(() => {
        const domNode = document.getElementById(this.diffIdentifier);
            if (!domNode) {
                console && console.error("Unable to find the Komponent@"+this.diffIdentifier);
                console && console.error("This is probably a lifeCycle error, current component state : ", this);
            }
            domNode.onclick = this.childRef.onClick;
            domNode.addEventListener("mouseleave", this.childRef.onMouseLeave);
            domNode.addEventListener("mouseenter", this.childRef.onMouseEnter);
            console.log("Bindings : ", domNode);
        });

    },

    /**
     * Function responsible to call the render of the component
     * @private
     */
    __render: function() {
        if (!this.childRef.render) {
            console.error("Komponent error: Unable to find render implementation. Ref dump : ", this.childRef);
        }
        this.renderedDom = this.childRef.render();

        if (!this.childFirstRendered)
            this.__spawnChildComponent();
        else
            this.__batchDiffRender();

        this.__eventsBinder();
    },

    /**
     * Will span the child component with the specified user instructions
     * Used for the initial spawn of the component
     * @private
     */
    __spawnChildComponent: function() {
        $(document).ready(() => {
            const targetDom = `
                <div id="${this.diffIdentifier}" class="komponent-differ-flag">
                    ${this.renderedDom}
                </div>
            `;

            if (this.childRef.preRenderCallback)
                this.childRef.preRenderCallback();

            let executor = this.childRef.renderMethod.customCallback;
            executor = this.childRef.renderMethod.setHtml ? (_rDom) => {
                $(this.childRef.renderMethod.targetContainer).html(_rDom);
            } : executor;
            executor = this.childRef.renderMethod.appendHtml ? (_rDom) => {
                $(this.childRef.renderMethod.targetContainer).append(_rDom);
            } : executor;
            executor(targetDom);

            if (this.childRef.postRenderCallback)
                this.childRef.postRenderCallback();

            this.childFirstRendered = true;
        });
    },

    __batchDiffRender: function() {
        // Safeguard for the user state mutating before DOM rendered first, may trigger container div unavailable
        // at lease here it will be batched after all DOM is rendered.
        $(document).ready(() => {
            $("#" + this.diffIdentifier).html(this.renderedDom);
        });
    },

    /** Komponent API */
    postRenderCallback: undefined,
    preRenderCallback: undefined,

    /**
     * Allows to change proprieties of the component at runtime and then retriggers the render by replacing previous
     * DOM with the next dom
     * @param targetState
     * @param afterCallBack
     */
    setState: function(targetState, afterCallBack) {
        this.state = Object.assign(this.state, targetState);
        console.warn("State update : ", this.state);
        this.__render();
        afterCallBack && afterCallBack();
    }
});
