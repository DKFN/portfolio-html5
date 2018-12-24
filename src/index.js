import {KomponentZookeeper} from "./komponents";
import {LangComponent} from "./Components/LangComponent";
import {IntroComponent} from "./Components/IntroComponent"
import {LoaderComponent} from "./Components/LoaderComponent";
import {IntroSkillEntry} from "./Components/IntroSkillEntry";
import {MenuEntry} from "./Components/MenuEntry";
import {ExperienceEntry} from "./Components/ExperienceEntry";

export const Index = () => {
        const langContext = () => {
          return [
              new LangComponent({fetchData: fetchData}),
          ]
        };

        // Here I Use currting so I can pass any container id I want to Komponent and make a loading wherever I want
        const loadersComponentContext = (trgt) => () => {
            return [
                new LoaderComponent({targetContainer: trgt}),
            ];
        };

        // Here it is the same idea, I will get data from the server, and the Zookeeper will need a function to spawn
        // my compoenents.
        // I render all my menu with the data I got from the JSON
        const indexContext = (data) => () => {
            /** Komponent firing ramp */
            console.log("From lambda data : ", data);
            return [
              ...data.menuEntries.map((x) => {
                return new MenuEntry(x)
              }),
              new IntroComponent(data.intro),
          ];
        };

        const experiencesContext = (data) => () => {
            return [
            ...data.experiences.map((x) => {
                 return new ExperienceEntry(x);
              })
            ];
        };

        const skillsContext = (data) => () => {
            return [
                ...data.skills.map(x => {
                    return new IntroSkillEntry(x)
                })
            ];
        };


        // Here it is how I fetch the lang for the user, see I spawn the
        const fetchData = (targetLang) => {
            KomponentZookeeper.spawnContext("default");
            KomponentZookeeper.clearContext("index");
            KomponentZookeeper.clearContext("xp");
            KomponentZookeeper.clearContext("introskills");

            $.ajax({
                url: "static/langs/" + targetLang + ".json",
                type: "GET",
                dataType: "json",
                success: function (data) {
                    KomponentZookeeper.registerContext("index", indexContext(data));
                    KomponentZookeeper.registerContext("xp", experiencesContext(data));
                    KomponentZookeeper.registerContext("introskills", skillsContext(data));
                    setTimeout(() => {
                        $(document).ready(() => {
                            KomponentZookeeper.reshowContext("index");
                            KomponentZookeeper.reshowContext("xp");
                            KomponentZookeeper.reshowContext("introskills");
                            KomponentZookeeper.clearContext("default");
                        });
                    }, 100);
                },
            }).done(function (data) {
                console.log(data)
            });
        };

        // I first spwan the loading spinner, I register it as "default", as it is the fallback context
        // After registering it to the Zookeeper I can spawn it on the screen
        KomponentZookeeper.registerContext("default", loadersComponentContext(".navbar-nav"));
        KomponentZookeeper.registerContext("lang", langContext);
        KomponentZookeeper.spawnContext("lang");
        fetchData("fr");
};

Index();
