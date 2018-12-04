const MenuEntry = Komponent.extend({
    renderMethod: {
        appendHtml: true,
        targetContainer: ".navbar-nav"
    },

    init: function(propsBag) {
        this._super(this, propsBag, {in: false});
        this.render = this.render.bind(this);
    },

    render: function() {
        return `
            <li class="nav-item">
                <a class="nav-link js-scroll-trigger" href="#${this.propsBag.anchor}">
                    ${this.propsBag.title}
                </a>
            </li>
        `;
    },
});
