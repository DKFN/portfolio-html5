import {FreeKomponent} from "../komponents";

export const ExperienceProject = FreeKomponent.extend({
   init: function(props) {
       this._super(this, props);
   },

    render: function() {

       const techsBadges = this.propsBag.techs.map (x => `
            <span class="resume-click-more">
                ${x}
            </span>
       `).join("");

       return `
       <h2>${this.propsBag.title}</h2>
            <div class="splasher-content">
                <p>
                    ${this.propsBag.description}
                </p>
                <div class="splasher-img-container">
                    ${ this.propsBag.backdrop !== "noBackdrop" &&
                        `<img src="${this.propsBag.backdrop}"/>` ||
                      ""}
                </div>
                <hr width="100%" />
                ${techsBadges}
            </div>
       `;
    }
});
