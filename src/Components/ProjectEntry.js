import {Komponent} from "../komponents";

export const ProjectEntry = Komponent.extend({
    renderMethod: {
         appendHtml: true,
         targetContainer: "#projects",
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
              <h3 class="mb-0">${this.propsBag.name}</h3>
              <div class="subheading mb-3">
                ${this.propsBag.title }
                </div>
              <p>
                ${this.propsBag.description}
              </p>
            </div>
            <div class="resume-date text-md-right">
              <span class="text-primary gh-link">
                <a href="${this.propsBag.link}">
                  <i class="fab fa-github"></i>
                </a>
              </span>
            </div>
        </div>
        `;
    },
});
