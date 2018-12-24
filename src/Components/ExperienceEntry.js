import {ShowMoreComponent} from "./ShowMoreComponent";
import {Komponent} from "../komponents";

export const ExperienceEntry = Komponent.extend({
    renderMethod: {
         appendHtml: true,
         targetContainer: "#experience",
         fadeSpawn: 1200,
    },

    subContextKey: undefined,

    init: function(props) {
        console.log(this);
        this._super(this, props, {});
        //this.onCreateCallback = this.onCreateCallback.bind(this);
        this.postRenderCallback = this.postRenderCallback.bind(this);
        this.subContextKey = "_#index" + this.diffIdentifier;
    },

    render: function() {
        console.log(this.propsBag);
        return `
        <div class="resume-item d-flex flex-column flex-md-row mb-5" id="${this.diffIdentifier}">
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
        KomponentZookeeper.spawnSubContext(this.subContextKey,
            () => [ new ShowMoreComponent(this.propsBag.showMore, this) ]
        );
    },

    onDestroyCallback: function() {
        KomponentZookeeper.clearContext(this.subContextKey);
    }
});
