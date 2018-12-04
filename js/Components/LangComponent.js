const LangComponent = Komponent.extend({
   renderMethod: {
       setHtml: true,
       targetContainer: "#lang-container",
   },

    init: function(props) {
        this._super(this, props, {currentLang: "en"});
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