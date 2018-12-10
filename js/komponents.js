let _Komponent_rKrefs = 0;
const KOMPONENTS_DEBUG = true;
const KOMPONENTS_WARN = true;

const Komponent = Class.extend({
    propsBag: undefined, // Props of the component
    state: undefined, // State of the component
    childRef: undefined, // Ref to the child, filled when builded
    renderedDom: undefined, // Final DOM after call to child's render()
    componentRendered: undefined, // Lifecycle boolean, does the component created ?
    diffIdentifier: undefined, // Idenfier used on setState() to replace content
    renderMethod: { // Proprieties to be defined by the child component
        targetContainer: undefined,
        setHtml: false,
        appendHtml: false,
        customCallback: undefined,
        containerClassName: undefined,
        dontWrap: false,
    },

    /**
     * Constructor, lots of things happening here
     * @param childRef
     * @param propsBag
     * @param initState
     */
    init: function(childRef, propsBag = undefined, initState = undefined) {
        _Komponent_rKrefs++;
        const mRef = _Komponent_rKrefs;
        KomponentDebug_d("Komponent : Popping component #" + mRef);

        this.propsBag = propsBag;
        this.childRef = childRef;
        this.state = initState;
        // FIXME: Let user override to desired
        this.diffIdentifier = "kompontent-differ-node-" + mRef;

        this.__render = this.__render.bind(this);
        this.__spawnChildComponent = this.__spawnChildComponent.bind(this);
        this.__eventsBinder = this.__eventsBinder.bind(this);
        this.__batchDiffRender = this.__batchDiffRender.bind(this);
        this.__wrap = this.__wrap.bind(this);

        this.__render();
        this.childRef.onCreateCallback && this.childRef.onCreateCallback();
        KomponentDebug_d("Komponent : Popped #" + mRef + " (Differ full ID : " + this.diffIdentifier + " )");
    },

    /**
     * This function will seek for user defined callBacks and attach triggered events to it
     * @private
     */
    __eventsBinder: function() {
        $(document).ready(() => {
        const domNode = $("#" + this.diffIdentifier)[0];
            if (!domNode) {
                console && console.error("Unable to find the Komponent@"+this.diffIdentifier);
                console && console.error("This is probably a lifeCycle error, current component state : ", this);
                console && console.error("Or maybe you did dontWrap but forgot diff ? ");
                return ;
            }
            KomponentDebug_d(domNode);
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
            console && console.error("Komponent error: Unable to find render implementation. Ref dump : ", this.childRef);
        }
        this.renderedDom = this.childRef.render();

        if (!this.componentRendered)
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
            const targetDom = this.__wrap();

            if (this.childRef.preRenderCallback)
                this.childRef.preRenderCallback();

            let executor = this.childRef.renderMethod.customCallback;
            executor = this.childRef.renderMethod.setHtml ? (_rDom) => {
                $(this.__getSelector()).html(_rDom);
            } : executor;
            executor = this.childRef.renderMethod.appendHtml ? (_rDom) => {
                $(this.__getSelector()).append(_rDom);
            } : executor;
            executor(targetDom);

            if (this.childRef.postRenderCallback)
                this.childRef.postRenderCallback();

            this.componentRendered = true;
        });
    },

    /**
     * Gets the appropriate selector for component
     */
    __getSelector: function() {
       const renderSelector = this.childRef.renderMethod.spawnInFather === true
       ? "#" + this.fatherKomponent.diffIdentifier + " > " + this.childRef.renderMethod.targetContainer
       : this.childRef.renderMethod.targetContainer;
       KomponentDebug_d("Render selector : ", renderSelector);
       return renderSelector;
    },

    /**
     * Wraps or not the element inside a differ for render lifecycle, callbacks etc etc
     */
    __wrap: function() {
        return this.renderMethod.dontWrap
            ? this.renderedDom
            :`
                <div 
                    id="${this.diffIdentifier}" 
                    style="unset:all;" 
                    class="komponent-differ-flag ${this.renderMethod.containerClassName || ""}"
                    >
                    <!-- You can disable wrapper div in renderMethod but if you rely on state you Must defined the diffIdentifier !-->
                    ${this.renderedDom}
                </div>
            `;
    },

    /**
     * Persists DOM mutation for the given component
     */
    __batchDiffRender: function() {
        // Safeguard for the user state mutating before DOM rendered first, may trigger container div unavailable
        // at lease here it will be batched after all DOM is rendered.
        $(document).ready(() => {
            $(this.__getSelector()).html(this.__wrap());
        });
    },

    /**
     * Will clear the node but keeps its props and state
     * @private
     */
    __destroy: function() {
        this.childRef.onDestroyCallback && this.childRef.onDestroyCallback();
        $("#" + this.diffIdentifier).remove();

        // On next render, component will be regenerated fully but will keep same props and state
        this.componentRendered = false;
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

    registerFather: function(father) {
        this.fatherKomponent = father;
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

    /**
     * Register a context spawner callback
     */
    registerContext: function(name, componentsFunction) {
        this.onScreenComponents[name] = undefined;
        this.poppers[name] = componentsFunction;
    },

    /**
     * Allows nesting of components, shows a components ands binds it to a context (and will be destroyed and updated as is)
     * @param name
     * @param component
     */
    spawnToContext: function(name, component) {
        // FIXME : This is broken
        console && console.error("Komponent Zookeeper : Sub context api is broken, you have to boilerplate context creation in container component");
        if (!this.onScreenComponents[name]) {
            KomponentDebug_w("Komponent Zookeeper: Context not on screen");
            KomponentDebug_w("Komponent Zookeeper: Wrapping component rendering. @" + name, component);
            this.poppers[name] = () => [
                this.poppers[name](),
                component()
            ];
            return ;
        }

        this.onScreenComponents[name][this.onScreenComponents[name].length || 0] = component;
        component.__render();
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

const KomponentDebug_d = function(text, object) {
        if (!KOMPONENTS_DEBUG)
            return;
        object ? console.info(text, object) : console.info(text);
    };


const KomponentDebug_w = function(text, object) {
        if (!KOMPONENTS_WARN)
            return;
        object ? console.warn(text, object) : console.info(text);
    };



const KomponentZookeeper = new _KomponentZookeeper();
window.KomponentZookeeper = KomponentZookeeper;
