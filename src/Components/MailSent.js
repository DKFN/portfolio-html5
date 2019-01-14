import {FreeKomponent, Komponent} from "../komponents";

export const MailSentComponent = Komponent.extend({
    renderMethod: {
        targetContainer: "#mail-container",
        setHtml: true,
    },

    render: function () {
        return `
            <div class="resume-click-more">
                Votre mail a ete envoye / Mail sent
            </div>
        `;
    }
});
