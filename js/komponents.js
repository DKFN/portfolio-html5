var _rKrefs = 0;
const KOMPONENTS_DEBUG = false;

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
        containerClassName: undefined,
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
        this._d("Komponent : Popping component #" + mRef);

        this.propsBag = propsBag;
        this.childRef = childRef;
        this.state = initState;
        this.diffIdentifier = "kompontent-differ-node-" + mRef;

        this.__render = this.__render.bind(this);
        this.__spawnChildComponent = this.__spawnChildComponent.bind(this);
        this.__eventsBinder = this.__eventsBinder.bind(this);
        this.__batchDiffRender = this.__batchDiffRender.bind(this);

        this.__render();
        this._d("Komponent : Popped #" + mRef + " (Differ full ID : " + this.diffIdentifier + " )");
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
            this._d("Bindings : ", domNode);
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
                <div id="${this.diffIdentifier}" style="unset:all;" class="komponent-differ-flag ${this.renderMethod.containerClassName || ""} ">
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

    __destroy: function() {
        $("#" + this.diffIdentifier).html("Destroyed");
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
        this._d("State update : ", this.state);
        this.__render();
        afterCallBack && afterCallBack();
    },

    _d(text, object) {
        if (!KOMPONENTS_DEBUG)
            return;
        object ? console.info(text, object) : console.info(text);
    }
});

const _KomponentZookeeper = Class.extend({
    instances: [],
    poppers: [], // Array of component function poppers and destroyers
    onScreenComponents: [],

    init: function() {
        this.spawnContext = this.spawnContext.bind(this);
        this.registerContext = this.registerContext.bind(this);
        this.clearContext = this.clearContext.bind(this);
    },

    registerContext: function(name, componentsFunction) {
        this.poppers[name] = componentsFunction;
    },

    spawnContext: function(name) {
        if (!this.poppers[name]) {
            console.error("Komponent: Context not found : ", name);
        }

        ///FIXME:  Should store on screen per context to allow partial context load and disload
        this.onScreenComponents[name] = this.poppers[name]();
    },

    /**
     * Should re-render all components with previous state, in non existant push warning an d
     * spawn new context
     * @param name
     */
    reshowContext: function(name = "default") {
        this.onScreenComponents[name].forEach(x => {
            x.__render();
        });
    },

    clearContext(name = "default") {
        this.onScreenComponents[name].forEach(x => {
            console.warn("Destroying : ", x);
            x.__destroy();
        });
    }

});

const KomponentZookeeper = new _KomponentZookeeper();
window.KomponentZookeeper = KomponentZookeeper;
