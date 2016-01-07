Meteor.publish('stocks', function () {
    if (this.userId) {
        return Stocks.find({user_id: this.userId});
    } else {
        this.ready();
    }
});

Meteor.publish('sprints', function () {
    if (this.userId) {
        return Sprints.find({users: this.userId});
    } else {
        this.ready();
    }
});

Meteor.publish("usernames", function () {
    if (this.userId) {
        return Meteor.users.find({}, {fields: {'profile': 1}});
    } else {
        this.ready();
    }
});


Meteor.publish("membersStocks", function (sprint_id) {
    if (this.userId && sprint_id) {
        var sprint = Sprints.findOne({_id: sprint_id});
        if (!sprint) {
            this.ready();
        } else {
            var ids = sprint.users.map(function (id) {
                if (id !== this.userId) return id;
            });

            var members = Meteor.users.find({_id: {$in: ids}}, {fields: {'profile': 1}});
            var stocks = Stocks.find({user_id: {$in: ids}, sprint_id: sprint_id});
            var data = [stocks, members];
            return data;
        }
    } else {
        this.ready();
    }

});

Meteor.publish('transactions', function (sprint_id) {
    if (!sprint_id) this.ready();
    var sprint = Sprints.findOne({_id: sprint_id});
    if (this.userId && sprint) {
        var sprint = Sprints.findOne({_id: sprint_id});
        return Transactions.find({user_id: {$in: sprint.users}}, {sort: {date: -1}});
    } else {
        this.ready();
    }
});

Meteor.publish('companies', function () {
    if (this.userId) {
        return Companies.find({}, {fields: {'name': 1, 'symbol': 1}});
    } else {
        this.ready();
    }
})