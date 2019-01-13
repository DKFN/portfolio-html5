import {Komponent} from "../komponents";

export const IntroSkillComplete  = Komponent.extend({
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
        this.render = this.render.bind(this);
        this.onClick = this.onClick.bind(this);
    },

    render: function() {
        return `
            <div class="introskill-extended-container">
                <h3>${this.propsBag.name}</h3><hr />
                <span class="introskill-description">${this.propsBag.description}</span>
                <br />
                <br />
                <i class="su-sml">- Cliquez pour revenir -</i>
            </div>
        `;
    },

    onClick() {
        KomponentZookeeper.clearSubContext(this.subKey);
        KomponentZookeeper.reshowContext("introskills");
    }
});
