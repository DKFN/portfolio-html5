const ExperienceEntry = Komponent.extend({
    renderMethod: {
         appendHtml: true,
         targetContainer: "#experience"
    },

    init: function(props) {
        this._super(this, props, {});
    },

    render: function() {
        return `
        <div class="resume-item d-flex flex-column flex-md-row mb-5">
            <div class="resume-content mr-auto">
              <h3 class="mb-0">${this.propsBag.position}</h3>
              <div class="subheading mb-3">${this.propsBag.company}</div>
              <p>
                ${this.propsBag.description}
              </p>
            </div>
            <div class="resume-date text-md-right">
              <span class="text-primary">${this.propsBag.durationText}</span>
            </div>
        </div>
        `;
    }
});
