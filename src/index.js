import {KomponentZookeeper} from "./komponents";
import {LangComponent} from "./Components/LangComponent";
import {IntroComponent} from "./Components/IntroComponent"
import {LoaderComponent} from "./Components/LoaderComponent";
import {IntroSkillEntry} from "./Components/IntroSkillEntry";
import {MenuEntry} from "./Components/MenuEntry";
import {ExperienceEntry} from "./Components/ExperienceEntry";
import {EducationEntry} from "./Components/EducationEntry";
import {ProjectEntry} from "./Components/ProjectEntry";

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

        const educationContext = (data) => () => {
            return [
                ...data.education.map((x) => {
                    return new EducationEntry(x);
                })
            ];
        };

        const projectContext = (data) => () => {
            return [
                ...data.projects.map((X) => {
                    return new ProjectEntry(X);
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
            KomponentZookeeper.clearContext("edu");
            KomponentZookeeper.clearContext("introskills");
            KomponentZookeeper.clearContext("projects");

            $.ajax({
                url: "static/langs/" + targetLang + ".json",
                type: "GET",
                dataType: "json",
                success: function (data) {
                    KomponentZookeeper.destroyContext("xp");
                    KomponentZookeeper.registerContext("index", indexContext(data));
                    KomponentZookeeper.registerContext("xp", experiencesContext(data));
                    KomponentZookeeper.registerContext("edu", educationContext(data));
                    KomponentZookeeper.registerContext("introskills", skillsContext(data));
                    KomponentZookeeper.registerContext("projects", projectContext(data));
                    setTimeout(() => {
                        $(document).ready(() => {
                            KomponentZookeeper.reshowContext("index");
                            KomponentZookeeper.reshowContext("xp");
                            KomponentZookeeper.reshowContext("edu");
                            KomponentZookeeper.reshowContext("introskills");
                            KomponentZookeeper.reshowContext("projects");
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
