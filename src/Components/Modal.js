import {Komponent, KomponentZookeeper} from "../komponents";
import {ModalClose} from "./ModalClose";
import {ExperienceProject} from "./ExperienceProject";

export const Modal = Komponent.extend({
    renderMethod: {
        setHtml: true,
        targetContainer: "#experience",
    },

    subKey: undefined,

    init: function(props) {
        this._super(this, props);
        this.subKey = props.k;
    },

    render: function() {
        const txt = this.propsBag.prev;
        const projects = txt.showMore.projects
            ? txt.showMore.projects.map(x => new ExperienceProject(x).render()).join("")
            : "";

        console.log(this.propsBag);
        return `
            <div class="splash-container">
                <div class="splasher">
                    <div class="splasher-header">
                    <div class="splasher-title">
                        <h1>
                            ${txt.company}
                            <span class="modal-close"></span>
                        </h1>
                        <hr />
                        <h4>${txt.position}</h4>
                    </div>
                    </div>
                    <hr style="height: 30px" />
                    ${ projects }
                </div>
            </div>
        `;
    },

    postRenderCallback: function() {
        this.lateUpdate(() => {
            $(".splasher").addClass("splasher-spawned");
            $(".splasher-title").addClass("splashertitle-spawned");
            KomponentZookeeper.spawnSubContext(KomponentZookeeper.randomString(), () => [new ModalClose(this.subKey)]);
        });
    },

    closeAll: function() {
        KomponentZookeeper.clearContext(this.subKey);
    }
});
