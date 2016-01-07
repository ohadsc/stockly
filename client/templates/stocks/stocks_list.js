
Template.stocksList.onRendered(function () {

    var sprint = this.data.sprint;
    var sprintsBtn = $("#sprintsDropDownBtn");
    sprintsBtn.text(sprint.name);
    sprintsBtn.val(sprint.name);
    sprintsBtn.data({id: sprint._id});

});

Template.stocksList.onCreated(function(){
    if (this.data) {
        var sprint = this.data.sprint;
        CUtils.updateStockPricesFromYahoo(sprint._id);
    }
});

Template.stocksList.helpers({

    stocks: function () {
        return CUtils.getUserStocks(this);
    },

    cash : function(){
        if (!this.sprint) return "";
        var sprint_id = this.sprint._id;
        var sprint = Sprints.findOne({_id: sprint_id});
        if (!sprint) return "NA"
        var userId = Meteor.userId();
        if (!sprint.cash) return "NA";
        var userCash = sprint.cash[userId];
        return numWithCommas(Number(userCash).toFixed(0));
    },

    total : function(){
        if (!this.sprint) return "";
        var sprint_id = this.sprint._id;
        var userTotal = calcTotal(Meteor.userId(), sprint_id);
        userTotal = Number(userTotal).toFixed(0);
        return numWithCommas(userTotal);
    },

    members : function(){
        if (!this.sprint) return "";
        var sprint_id = this.sprint._id;
        var users = getSprintUsers(sprint_id);
        return users;
    },

    teamSize : function(){
        if (!this.sprint) return "";
        var sprint_id = this.sprint._id;
        var users = StocksUtils.getSprintMembers(sprint_id, true);
        return users.length;
    },

    hasStocks: function(){
        return _hasStocks(this);
    },

    memberHasStocks : function(){
        return _hasStocks(this, this._id);
    },

    pendingSprint : function () {
        var sprint_id = this.sprint._id;
        var sprint = Sprints.findOne({_id : sprint_id});
        var isPending = !sprint.status || "Pending" === sprint.status;
        var hasStocks = _hasStocks(this);
        return isPending && hasStocks;
    },

    sprintsList: function () {
        var sprints = $.map(Sprints.find({users: Meteor.userId()}).fetch(), function (sprint, i) {
            return {name: sprint.name, tab: i, id: sprint._id};
        });
        return sprints;
    },

    sprintName : function(){
        if (!this.sprint) return "";
        var sprint_id = this.sprint._id;
        var sprint = Sprints.findOne({_id : sprint_id});
        return sprint.name;
    },

    memberTotal :function(){
        return numWithCommas(Number(this.total).toFixed(0));
    },

    myColor : function () {
        if (this._id === Meteor.userId()){
            var sprint_id = Template.instance().data.sprint._id;
            var users = StocksUtils.getSprintMembers(sprint_id, true);
            if (users.length !== 1) {
                return "blue-background";
            }
        }
        return "";
    },

    myPosition : function(){
        if (!Template.instance().data) return "";
        var sprint_id = Template.instance().data.sprint._id;
        var users = getSprintUsers(sprint_id);
        var myPosition = 0;
        $.each(users, function( index, user ) {
            if (user._id === Meteor.userId()){
                myPosition = user.position;
            }
        });
        return myPosition + "/" + users.length;
    }
});

function _hasStocks(template, userId){
    var stockz = CUtils.getUserStocks(template, userId);
    return stockz && stockz.fetch().length > 0;
}

Template.stocksList.events({

    'click button.btn.btn-success.btn-xs.sell': function (event, template) {
        event.preventDefault();
        var sprint_id = this.sprint._id;
        var user_id = Meteor.userId();
        var stocks = Stocks.find({sprint_id : sprint_id, user_id : user_id}).fetch();
        if (stocks.length === 1){
            var stock = stocks[0];
            Router.go('/sprints/' + sprint_id+ '/sell/' + stock._id);
        } else {
            Router.go('/sprints/' + sprint_id + '/sell');
        }
    },

    'click button.btn.btn-success.btn-xs.buy': function (event) {
        event.preventDefault();
        var sprint_id = this.sprint._id;
        Router.go('/sprints/' + sprint_id + '/stocks/buy');
    },

    'click button.btn.btn-success.btn-xs.invite': function (event, template) {
        event.preventDefault();
        var sprint_id = this.sprint._id;
        Router.go('/sprints/' + sprint_id + '/invite');
    },

    'click button.btn.btn-info.btn-xs.transactions': function (event, template) {
        event.preventDefault();
        var sprint_id = this.sprint._id;
        Router.go('/sprints/' + sprint_id + '/transactions');
    }


});


function numWithCommas(x){
    return x.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}


function calcTotal(userId, sprint_id){
    return StocksUtils.calcTotal(userId, sprint_id);
}

function compare(a,b) {
    if (a.total < b.total)
        return -1;
    if (a.total > b.total)
        return 1;
    return 0;
}

function getSprintUsers(sprint_id){
    var users = StocksUtils.getSprintMembers(sprint_id, true);
    $.each(users, function( index, user ) {
        var userStocks = Stocks.find({user_id : user._id, sprint_id: sprint_id}).fetch();
        user.ustocks = userStocks;
        var userTotal = calcTotal(user._id, sprint_id);
        user.total = parseFloat(userTotal);
    });
    users.sort(compare);
    users.reverse()
    $.each(users, function( index, user ) {
        user.position = index + 1;
    });
    return users;
}