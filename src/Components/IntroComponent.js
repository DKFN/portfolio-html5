import {Komponent} from "../komponents";

export const IntroComponent = Komponent.extend({
   renderMethod: {
       setHtml: true,
       targetContainer: "#about",
       containerClassName: "my-auto",
       fadeSpawn: 2500,
       fadePredelay: 500,
   },

    init: function(props) {
       this._super(this, props, null);
       this.render = this.render.bind(this);
    },

    render: function() {
        return `
          <h1 class="mb-0">Valere
            <span class="text-primary">Tetelin</span>
          </h1>
          <div class="subheading mb-5">
            ${this.propsBag.title}
          </div>
          <p class="lead mb-5">${this.propsBag.currentPosition}</p>
            ${this.propsBag.body.join("")}
          <br /> <br />
          
        `;
    }
});