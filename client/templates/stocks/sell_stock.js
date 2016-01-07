Template.sellStock.events({

    'click .list-group-item': function (event, template) {
        event.preventDefault();
        var sprint_id = template.data.sprint._id;
        var stock_id = this._id;
        Router.go('/sprints/' + sprint_id + '/sell/' + stock_id);
    }

});

Template.sellStock.helpers({

    stocks: function () {
        return CUtils.getUserStocks(this);
    },

    stockSymbol : function(){
        return this.Symbol.toUpperCase();
    }
});