```
 __    __                                                                              __                   _____   ______  
/  |  /  |                                                                            /  |                 /     | /      \ 
$$ | /$$/   ______   _____  ____    ______    ______   _______    ______   _______   _$$ |_     _______    $$$$$ |/$$$$$$  |
$$ |/$$/   /      \ /     \/    \  /      \  /      \ /       \  /      \ /       \ / $$   |   /       |      $$ |$$ \__$$/ 
$$  $$<   /$$$$$$  |$$$$$$ $$$$  |/$$$$$$  |/$$$$$$  |$$$$$$$  |/$$$$$$  |$$$$$$$  |$$$$$$/   /$$$$$$$/  __   $$ |$$      \ 
$$$$$  \  $$ |  $$ |$$ | $$ | $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$    $$ |$$ |  $$ |  $$ | __ $$      \ /  |  $$ | $$$$$$  |
$$ |$$  \ $$ \__$$ |$$ | $$ | $$ |$$ |__$$ |$$ \__$$ |$$ |  $$ |$$$$$$$$/ $$ |  $$ |  $$ |/  | $$$$$$  |$$ \__$$ |/  \__$$ |
$$ | $$  |$$    $$/ $$ | $$ | $$ |$$    $$/ $$    $$/ $$ |  $$ |$$       |$$ |  $$ |  $$  $$/ /     $$/ $$    $$/ $$    $$/ 
$$/   $$/  $$$$$$/  $$/  $$/  $$/ $$$$$$$/   $$$$$$/  $$/   $$/  $$$$$$$/ $$/   $$/    $$$$/  $$$$$$$/   $$$$$$/   $$$$$$/  
                                  $$ |                                                                                      
                                  $$ |                                                                                      
                                  $$/                                                                                       
```

# What is Komponents?

Components aims to be a simple and easy to use component framework with very light dependency requirements.

The goal of Komponents is to bring React style components with immutable Props and mutable state. This is the only similarity with React.

Unlike React, each component is independant on its own and they are not a tree but rather a flat array.
However, you can still communicate between components and trigger render of components inside a component.

It is composed of two fundamental Objects:

- Komponent: The base class you need to extend for the component to be a Komponent.
- Zookeper: Allows you to group your component by context (loading, modal, main, etc..) is callable 
            from anywhere and allows easy component interaction, you can spawn, hide and destroy group of components.

Please note that this project is only for fun, it is used on my portfolio but has no real world production ambition.

An example of implementation can be found here: 

# Your first component inside your app
## Simple stateless component
A component must define a few things:
- A render() method, that will be called when state updates or component re-creaction
- A renderMethod object, with few proprieties you need to specify the id/class of the container and if you want to replace or append to the html of the container (you can also define few callbacks if you need more control on the rendering lifecycle)
- A constructor to pass your reference and your props to Komponent base class

Create a HelloWorld.js file

Your first HelloWorld component should look like that:
```javascript
const HelloWorldComponent = Komponent.extend({
   renderMethod: {
       setHtml: true,
       targetContainer: "#hello-world",
   },

    init: function(props) {
        this._super(this, props);
    },

    render: function() {
       return `<b>Hello World !</b> My name is : ${this.props.name}`;
    }
});
```

Great ! You now, need an index.html, let's keep it basic:
```html
<!DOCTYPE html>
<html>
    <body>
        <div id="hello-world">
        
        </div>
        <script type="text/javascript">
            // Lets create an arrow function that will return all the components of our app
            // Of course, there is only one yet :)
            const HelloWorldContext = () => {
                return [
                    new HelloWorldComponent({name: "Pierre"}),
                ];
            };
            
            // Here we register the default component group (a context) to the ZooKeeper
            KomponentZookeeper.registerContext("default", HelloWorldContext);
            
            // And then we tell the zookeeper to show the components
            KomponentZookeeper.spawnContext("default");
        </script>
    </body>
</html>
```

## Lets add some state
A few words about the this.setState function.

It is avaibale wherever you extend the Komponent base class, when you trigger a state update the render() function will immediatly called after with the newest state values.

Let's implement a simple toggelable quote whenever someone clickson the HelloWorld text it should reveal a quote:

```javascript
const HelloWorldComponent = Komponent.extend({
   renderMethod: {
       setHtml: true,
       targetContainer: "#hello-world",
   },

    init: function(props) {
       // I changed the constructor call to add the initial state 
       this._super(this, props, {showQuote: false});
       this.onClick = this.onClick.bind(this);
    },

    render: function() {
       const quoteChunck = this.state.showQuote 
        ? `> <i>Lorem ipsum<i>`
        : `>`;
       
       return `<b>Hello World !</b> My name is : ${this.props.name} <br /> ${quoteChunck}`;
    },
    
    // And I add an OnClick handler on my component that will change the state
    // The base Komponent class will register the callBack
    onClick: function(event) {
       this.setState({showQuote: !this.state.showQuote})
    }
});
```

## Handling communication between components

## Creating components inside components

## Communicating with API and

## Going further with the ZooKeeper

