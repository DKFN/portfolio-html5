const IntroComponent = Komponent.extend({
   renderMethod: {
       setHtml: true,
       targetContainer: "#about",
       containerClassName: "my-auto"
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
          <div class="subheading mb-5"><span class="text-primary">Scala</span> && Typescript Fullstack Developper
          </div>
          <p class="lead mb-5">At <img src="img/cplus.gif" height="16px"/> for <span class="text-primary">2 years</span> now.</p>
          I am working on a GraphQL gateway and on the main REST API behind all our frontend applications in a team of <span class="text-primary">20 developpers</span><br />
          Working with Scalable Reactive systems on a daily basis, with the help of <span class="text-primary">Play!</span> Framework, <span class="text-primary">Akka</span>, <span class="text-primary">Kafka</span>, <span class="text-primary">Cassandra</span> and <span class="text-primary">Redis</span>.<br />
          Convinced by <span class="text-primary">Agile</span> developpement cycle and <span class="text-primary">TDD</span> practices. I'm used to working with AWS, Docker and Immutable State infrastructure (Salt Stack and recently, Kubernetes) <br />
          I used to be a Frontend consultant working on many Canal+'s technical backoffices.<br />
          I was hired after some month in an Internship while working on an Engineering Degree at EPITA.<br />
          I mainly do Scala but I am from a Frontend world I am still working on javascript libraries for CanalPlus frontend developpers and some R&D frontend applications.
          <br /> <br />
          <div class="social-icons">
            <a href="https://www.linkedin.com/in/valere-tetelin-514323b7/">
              <i class="fab fa-linkedin-in"></i>
            </a>
            <a href="https://github.com/DKFN">
              <i class="fab fa-github"></i>
            </a>
          </div>
        `;
    }
});