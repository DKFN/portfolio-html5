const ShowMoreComponent = Komponent.extend({
    renderMethod: {
         appendHtml: true,
         dontWrap: true,
         spawnInFather: true,
         targetContainer: ".resume-item > .resume-date"
    },

    init: function(props, father)  {
        this._super(this, props, {});
        this.registerFather(father);
    },

    render: function() {
        return `
            <div class="resume-click-more text-md-right" id="${this.diffIdentifier}">
               En savoir plus
           </div>`;
    }
});
