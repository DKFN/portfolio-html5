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
        KomponentDebug_d("Komponent : Popping component #" + mRef);

        this.propsBag = propsBag;
        this.childRef = childRef;
        this.state = initState;
        this.diffIdentifier = "kompontent-differ-node-" + mRef;

        this.__render = this.__render.bind(this);
        this.__spawnChildComponent = this.__spawnChildComponent.bind(this);
        this.__eventsBinder = this.__eventsBinder.bind(this);
        this.__batchDiffRender = this.__batchDiffRender.bind(this);

        this.__render();
        KomponentDebug_d("Komponent : Popped #" + mRef + " (Differ full ID : " + this.diffIdentifier + " )");
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
                return ;
            }
            domNode.onclick = this.childRef.onClick;
            domNode.addEventListener("mouseleave", this.childRef.onMouseLeave);
            domNode.addEventListener("mouseenter", this.childRef.onMouseEnter);
            KomponentDebug_d("Bindings : ", domNode);
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

    /**
     * Persists DOM mutation for the given component
     */
    __batchDiffRender: function() {
        // Safeguard for the user state mutating before DOM rendered first, may trigger container div unavailable
        // at lease here it will be batched after all DOM is rendered.
        $(document).ready(() => {
            $("#" + this.diffIdentifier).html(this.renderedDom);
        });
    },

    __destroy: function() {
        $("#" + this.diffIdentifier).html("<!-- Destroyed by Komponent(@"+ this.diffIdentifier+")");
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
        KomponentDebug_d("State update : ", this.state);
        this.__render();
        afterCallBack && afterCallBack();
    },
});

const KomponentDebug_d = function(text, object) {
        if (!KOMPONENTS_DEBUG)
            return;
        object ? console.info(text, object) : console.info(text);
    };

const _KomponentZookeeper = Class.extend({
    instances: [],
    poppers: [], // Array of component function poppers and destroyers
    onScreenComponents: [],

    init: function() {
        this.spawnContext = this.spawnContext.bind(this);
        this.registerContext = this.registerContext.bind(this);
        this.clearContext = this.clearContext.bind(this);
    },

    /**
     * Register a context spawner callback
     */
    registerContext: function(name, componentsFunction) {
        this.onScreenComponents[name] = undefined;
        this.poppers[name] = componentsFunction;
    },

    /**
     * Shows a context to the user screen, if it was previously loaded it keeps its state
     * @param name
     */
    spawnContext: function(name) {
        if (!this.poppers[name]) {
            console.error("Komponent Zookeeper: Context not found : ", name);
            return;
        }

        if (typeof this.poppers[name] !== "function") {
            console.error("Komponent Zookeeper : Context is not a function: ", name);
            console.error("Komponent Zookeeper : You should pass function like: functionName not functionName(): ", name);
            return ;
        }


        KomponentDebug_d("Spawning: ", this.poppers[name]);

        this.onScreenComponents[name] = this.poppers[name]();
    },

    /**
     * Should re-render all components with previous state, in non existant push warning an d
     * spawn new context
     * @param name
     */
    reshowContext: function(name = "default") {
        if (!this.onScreenComponents[name]){
            KomponentDebug_d("Komponents Zookeeper: Unable to find previous context, spawning new one");
            this.spawnContext(name);
            return ;
        }

        this.onScreenComponents[name].forEach(x => {
            x.__render();
        });
    },


    /**
     * Hides a particular context to the user screen
     */
    clearContext(name = "default") {
        if (!this.onScreenComponents[name])
            return;
        this.onScreenComponents[name].forEach(x => {
            KomponentDebug_d("Destroying : ", x);
            x.__destroy();
        });
    }

});

const KomponentZookeeper = new _KomponentZookeeper();
window.KomponentZookeeper = KomponentZookeeper;
