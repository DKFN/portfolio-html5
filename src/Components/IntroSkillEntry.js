import {Komponent} from "../komponents";
import {IntroSkillComplete} from "./IntroSkillComplete";
import {StarFreeComponent} from "./StarFreeKomponent";

export const IntroSkillEntry = Komponent.extend({
    renderMethod: {
        appendHtml: true,
        targetContainer: "#introskills-container",
        fadeSpawn: 1000,
        fadePredelay: 100,
    },

    subKey: undefined,

    init: function (propsBag) {
        this._super(this, propsBag, {shown: false});
        this.render = this.render.bind(this);
        this.onClick = this.onClick.bind(this);
        this.subKey = KomponentZookeeper.randomString();
    },

    render: function () {
        return `
            <div class="introskill-container">
                <h4>${this.propsBag.name}</h4><hr />
                ${ new StarFreeComponent(this.propsBag).render() }
                <div class="su-flex introskill-footer" style="justify-content: right">
                    <div class="introskill-category">
                        ${this.propsBag.category || "None"}
                    </div>
                    <div class="introskill-more" style="text-align: right">
                        <i class="fa fa-plus-circle"></i>
                    </div>
                </div>
            </div>
        `;
    },


    onClick: function() {
            let _p = this.propsBag;
            let _sk = this.subKey;
            this.lateUpdate(() => {
                KomponentZookeeper.clearContext("introskills");
                KomponentZookeeper.spawnSubContext(this.subKey, () => [
                    new IntroSkillComplete(_p, _sk)
                ]);
            });
        this.setState({shown: !this.state.shown});
    }
});
