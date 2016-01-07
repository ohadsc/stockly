Router.configure({
    layoutTemplate: 'layout',  //can be any template name
    loadingTemplate: 'loading',
    waitOn: function () {
        return Meteor.subscribe('stocks');
    }
});

Router.map(function () {

    _.each(["/", "stocks"], function (path) {
        Router.route(path, {
            onBeforeAction: function (pause) {
                var user = Meteor.user();
                if (user) {
                    var sprint_id = user.profile.default_sprint;
                    var defaultSprint = Sprints.findOne({_id : sprint_id});
                    if (!sprint_id || !defaultSprint) {
                        var sprints = Sprints.find({users: Meteor.userId()});
                        var sprint = sprints.fetch()[0];
                        if (sprint) {
                            sprint_id = sprint._id;
                        }
                    }
                    if (sprint_id) {
                        this.router.go('/sprints/' + sprint_id + '/stocks');
                    }
                }
                this.next();

            },
            template: 'stocksList'
        });
    });

    this.route('/sprints/:sprint_id/stocks', {
        path: '/sprints/:sprint_id/stocks',
        data: function () {
            var sprint_id = this.params.sprint_id;
            var stocks = Stocks.find({sprint_id: sprint_id});
            var sprint = Sprints.findOne({_id : sprint_id});
            return {stocks : stocks, sprint : sprint};
        },
        loadingTemplate: 'loading',
        waitOn: function() {
            return Meteor.subscribe( 'membersStocks', this.params.sprint_id );
        },
        template: 'stocksList'
    });

    this.route('/login', {
        template: 'login'
    });

    this.route('sprints', {
        data: function () {
            return Sprints.find()
        },  //set template data context
        template: 'sprintsList'
    });

    this.route('username/new', {
        template: 'updateUsername'
    });

    this.route('sprints/:sprint_id/sell', {
        template: 'sellStock',
        path: '/sprints/:sprint_id/sell',
        data: function() {
            var sprint = Sprints.findOne(this.params.sprint_id);
            return {sprint : sprint};
        }
    });

    this.route('/sprints/:sprint_id/invite', {
        template: 'inviteUser',
        path: '/sprints/:sprint_id/invite',
        data: function() {
            var sprint = Sprints.findOne(this.params.sprint_id);
            return {sprint : sprint};
        }
    });

    this.route('/sprints/:sprint_id/sell/:stock_id', {
        template: 'sellStockConfirm',
        path: '/sprints/:sprint_id/sell/:stock_id',
        data: function() {
            var sprint = Sprints.findOne(this.params.sprint_id);
            var stock = Stocks.findOne(this.params.stock_id);
            return {sprint : sprint, stock: stock};
        }
    });

    this.route('/profile/edit', {
        template: 'userDetails',
        path: '/profile/edit',
    });

    this.route('/change/password', {
        template: 'changePassword',
        path: '/change/password',
    });

    this.route('/sprints/:sprint_id/transactions', {
        template: 'transactionList',
        path: '/sprints/:sprint_id/transactions',
        data: function() {
            var sprint = Sprints.findOne(this.params.sprint_id);
            return {sprint : sprint};
        },
        waitOn: function() {
            return Meteor.subscribe('transactions', this.params.sprint_id);

        }
    });

    this.route('/sprints/new', {
        template: 'createSprint',
        path: '/sprints/new',
    });

    this.route('/sprints/:sprint_id/stocks/buy',  {
        template: 'buyStock',
        path: '/sprints/:sprint_id/stocks/buy',
        data: function() {
            var sprint = Sprints.findOne(this.params.sprint_id);
            return {sprint : sprint};
        }/*,
        waitOn: function() {
            return Meteor.subscribe('companies');
        },*/
    });
});

Router.onBeforeAction(function () {
    var user =  Meteor.user();
    if (user === null){
        this.router.go('/');
        this.next();
    } else {
        if (!user) {
            this.next();
        } else if (!user.profile || !user.profile.username) {
            this.render('updateUsername');
        } else {
            this.next();
        }
    }
});