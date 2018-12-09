const ExperienceEntry = Komponent.extend({
    renderMethod: {
         appendHtml: true,
         targetContainer: "#experience"
    },

    subContextKey: undefined,

    init: function(props) {
        this._super(this, props, {});
        this.postRenderCallback = this.postRenderCallback.bind(this);
    },

    render: function() {
        console.log(this.propsBag);
        return `
        <div class="resume-item d-flex flex-column flex-md-row mb-5">
            <div class="resume-content mr-auto">
              <h3 class="mb-0">${this.propsBag.position}</h3>
              <div class="subheading mb-3">
                ${this.propsBag.companyImg ? this.propsBag.companyImg : this.propsBag.company}
                </div>
              <p>
                ${this.propsBag.description}
              </p>
            </div>
            <div class="resume-date text-md-right">
              <span class="text-primary">${this.propsBag.durationText}</span>
            </div>
        </div>
        `;
    },

    postRenderCallback: function() {
        this.subContextKey = "experience" + this.diffIdentifier;

        KomponentZookeeper.registerContext(this.subContextKey, () => {
            return [
                new ShowMoreComponent(this.propsBag.showMore, this),
            ];
        });

        KomponentZookeeper.spawnContext(this.subContextKey)
    },

    onDestroyCallback: function() {
        KomponentZookeeper.clearContext(this.subContextKey);
    }
});
