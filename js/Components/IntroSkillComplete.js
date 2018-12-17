const IntroSkillComplete  = Komponent.extend({
    renderMethod: {
        setHtml: true,
        targetContainer: "#introskills-container",
        fadeSpawn: 500,
        fadePredelay: 100,
    },

    subKey: undefined,

    init: function(propsBag, selfSubKey) {
        this._super(this, propsBag, {shown: false});
        this.subKey = selfSubKey;
        console.log("Subkey del : ", this.subKey);
        this.render = this.render.bind(this);
        this.onClick = this.onClick.bind(this);
    },

    render: function() {
        return `
            <div class="introskill-extended-container">
                <h3>${this.propsBag.name}</h3><hr />
                <span class="introskill-seemore">${this.propsBag.description}</span>
                <br />
                <br />
                <i class="su-sml">- Cliquez pour revenir -</i>
            </div>
        `;
    },

    onClick() {
        console.log("Subkey del : ", this.subKey);
        KomponentZookeeper.clearSubContext(this.subKey);
        KomponentZookeeper.reshowContext("introskills");
    }
});
