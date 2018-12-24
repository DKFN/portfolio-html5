import {KomponentZookeeper} from "../komponents";
import {ModalClose} from "./ModalClose";

export const Modal = Komponent.extend({
    renderMethod: {
        setHtml: true,
        targetContainer: "#experience",
    },

    subKey: undefined,

    init: function(subKey) {
        this._super(this);
        this.subKey = subKey;
    },

    render: function() {
        let _t = this;
        return `
            <div class="splash-container">
                <div class="splasher">
                    <div class="splasher-header">
                    <div class="splasher-title">
                        <h1>
                            Test
                            <span class="modal-close"></span>
                        </h1>
                        <hr />
                        <h4>Position reminder around here</h4>
                    </div>
                    </div>
                    <h2>HAPI</h2>
                    <div class="splasher-content">
                    <p>This is the test of the HAPI content you kow</p>
                        <div class="splasher-img-container">
                            <img src="https://docs.microsoft.com/fr-fr/azure/cloud-shell/media/persisting-shell-storage/mount-h.png"/>
                        </div>
                    </div>
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
