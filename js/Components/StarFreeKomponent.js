const StarFreeComponent = FreeKomponent.extend({

    init(props) {
        this._super(this, props);
        this.getRating = this.getRating.bind(this);
    },

    render: function(){
        console.log(this.propsBag);
        return this.getRating();
    },

    getRating: function () {
        let arr = [];
        for (i = 0; i < this.propsBag.rating; ++i)
            arr.push(`<i class="fa fa-star" aria-hidden="true"></i>`);
        for (; i < 5; ++i)
            arr.push(`<i class="fa fa-star star-empty" aria-hidden="true"></i>`);
        return `<div> ${arr.join("")} </div>`;
    },
});