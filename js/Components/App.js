const App = () => {
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
              ...data.experiences.map((x) => {
                 return new ExperienceEntry(x);
              }),
              new ExperienceEntry({
              position: "Scala/Typescript FullStack Developper",
              company: "Canal+",
              description: "test :)",
              durationText: "September 2017 - Present"
            }),
          ];
        };


        // Here it is how I fetch the lang for the user, see I spawn the
        const fetchData = (targetLang) => {
            KomponentZookeeper.spawnContext("default");
            KomponentZookeeper.clearContext("index");
            $.ajax({
                url: "langs/" + targetLang + ".json",
                type: "GET",
                dataType: "json",
                success: function (data) {
                    KomponentZookeeper.registerContext("index", indexContext(data));
                    setTimeout(() => {
                        $(document).ready(() => {
                            KomponentZookeeper.reshowContext("index");
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

App();
