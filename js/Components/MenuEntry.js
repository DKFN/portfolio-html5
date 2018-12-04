const MenuEntry = Komponent.extend({
    renderMethod: {
        appendHtml: true,
        targetContainer: ".navbar-nav"
    },

    init: function(propsBag) {
        this._super(this, propsBag, {in: false});
        this.render = this.render.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    },

    render: function() {
        console.log("Render loop : ", this);
        return `
            <li class="nav-item">
                <a class="nav-link js-scroll-trigger" href="#${this.propsBag.anchor}">
                    ${this.state.in ? ">" : ""}
                    ${this.propsBag.title}
                </a>
            </li>
        `;
    },

    onMouseEnter: function(event) {
        if (this.state.in)
            return;
        this.setState({in: true});
    },

    onMouseLeave: function(event) {
        setTimeout(() => this.setState({in: false}), 200);
    }
});
