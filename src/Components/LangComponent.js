import {Komponent} from "../komponents";

export const LangComponent = Komponent.extend({
   renderMethod: {
       setHtml: true,
       targetContainer: "#lang-container",
       fadeSpawn: 1000,
       fadePredelay: 1000,
   },

    init: function(props) {
       console.log(this);
        this._super(this, props, {currentLang: "fr"});
        this.onClick = this.onClick.bind(this);
    },

    render: function() {
        return this.state.currentLang === "fr" ? "<u>FR</u> | EN" : "FR | <u>EN</u>";
    },

    onClick: function() {
       this.setState(
           {currentLang: this.state.currentLang === "fr" ? "en" : "fr"},
           () => this.propsBag.fetchData(this.state.currentLang)
       );
    }
});