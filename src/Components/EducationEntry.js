import {Komponent} from "../komponents";

export const EducationEntry = Komponent.extend({
    renderMethod: {
         appendHtml: true,
         targetContainer: "#education",
         fadeSpawn: 1200,
    },

    subContextKey: undefined,

    init: function(props) {
        console.log(this);
        this._super(this, props, {});
        //this.onCreateCallback = this.onCreateCallback.bind(this);
        this.subContextKey = "_#index" + this.diffIdentifier;
    },

    render: function() {
        return `
        <div class="resume-item d-flex flex-column flex-md-row mb-5" id="${this.diffIdentifier}">
            <div class="resume-content mr-auto">
              <h3 class="mb-0">${this.propsBag.diploma}</h3>
              <div class="subheading mb-3">
                ${this.propsBag.name }
                </div>
              <p>
                ${this.propsBag.description}
              </p>
            </div>
            <div class="resume-date text-md-right">
              <span class="text-primary">${this.propsBag.duration}</span>
            </div>
        </div>
        `;
    },
});
