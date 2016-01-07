StocksUtils = {

    getSprintMembersIds: function (sprint_id, withMe) {
        var sprint = Sprints.findOne({_id: sprint_id});
        if (!sprint.users) return [];
        var ids = sprint.users.map(function (id) {
            if (withMe || id !== Meteor.userId()) return id;
        });
        return ids;
    },

    getSprintMembers: function (sprint_id, withMe) {
        var ids = this.getSprintMembersIds(sprint_id, withMe);
        var users = Meteor.users.find({_id: {$in: ids}}).fetch();
        return users;
    },

    calcTotal: function (userId, sprint_id) {
        var sum = 0.00;
        var sprint = Sprints.findOne({_id: sprint_id});
        var stocks = Stocks.find({user_id: userId, sprint_id: sprint_id}).fetch();
        for (var i = 0; i < stocks.length; i++) {
            var amount = stocks[i].amount;
            var price = stocks[i].LastTradePriceOnly;
            sum += amount * price;
        }
        if (!sprint || !sprint.cash) return 0;
        sum += sprint.cash[userId];
        return sum;
    }
}