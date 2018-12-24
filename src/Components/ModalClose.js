export const ModalClose = Komponent.extend({
    renderMethod: {
        setHtml: true,
        targetContainer: ".modal-close",
        dontWrap: true,
    },

    subKey: undefined,

    init: function(subKey) {
        this._super(this);
        this.subKey = subKey;
        this.onClick = this.onClick.bind(this);
    },

    render: function() {
        return `
                            <span class="close -pull-right" id="${this.diffIdentifier}">
                                <i class="fa fa-window-close" aria-hidden="true"></i>
                                Close
                            </span>`;
    },

    onClick: function() {
        KomponentZookeeper.reshowContext("xp");
        KomponentZookeeper.clearSubContext(this.subKey);
    }
});