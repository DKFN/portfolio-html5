const IntroSkillEntry = Komponent.extend({
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
                <h3>${this.propsBag.name}</h3><hr />
                ${ new StarFreeComponent(this.propsBag).render() }
                <div class="introskill-more -pull-right">
                    <i class="fa fa-plus-circle"></i>
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
