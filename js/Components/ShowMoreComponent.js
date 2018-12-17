const ShowMoreComponent = Komponent.extend({
    renderMethod: {
         appendHtml: true,
         dontWrap: true,
         spawnInFather: true,
         targetContainer: ".resume-item > .resume-date"
    },

    subContextKey: undefined,

    init: function(props, father)  {
        this._super(this, props, {});
        this.registerFather(father);
        this.onClick = this.onClick.bind(this);
        this.subContextKey = KomponentZookeeper.randomString();
    },

    render: function() {
        return `
            <a href="#experience" rel="modal:open" class="resume-click-more text-md-right" id="${this.diffIdentifier}">
                En savoir plus
           </a>`;
    },

    onClick: function() {
        setTimeout(() => {
            KomponentZookeeper.clearContext("xp");
            KomponentZookeeper.spawnSubContext(this.subContextKey,
                () => [ new Modal(this.subContextKey) ]
            );
        }, 100);
    }

});
