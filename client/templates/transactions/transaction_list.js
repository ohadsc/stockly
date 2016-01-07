Template.transactionList.onCreated(function() {
    var state = new ReactiveDict;
    this.state = state;
    state.set("userTransactions", []);
});


Template.transactionList.onRendered(function(){
    $(".transaction_list").hide();
});

Template.transactionList.helpers({

    usersList : function(){
        var sprint_id = this.sprint._id;
        var users = StocksUtils.getSprintMembers(sprint_id, true);
        return users;
    },

    userTransactions : function(){
        var trans = Template.instance().state.get("userTransactions") || [];
        return trans;
    },

    prettyDate : function(){
        var date = this.date;
        return moment(date).format('MM-DD-YYYY HH:MM:SS');
    },

    revenue : function(transaction_id){
        if (this.type === "sell") {
            var buyValue = parseFloat(this.stock.buy_price) * parseInt(this.stock.amount);
            var sellValue = parseFloat(this.price) * parseInt(this.stock.amount);
            var rev = sellValue - buyValue;
            var plus = rev > 0 ? "+" : "";
            return plus + Number(rev).toFixed(2);
        } else {
            return "-";
        }
    },

    color : function(){
        var buyValue = parseFloat(this.stock.buy_price) * parseInt(this.stock.amount);
        var sellValue = parseFloat(this.price) * parseInt(this.stock.amount);
        var rev = sellValue - buyValue;
        var color = "";
        if (rev < 0) {
            color =  "red";
        } else if (rev > 0) {
            color = "green";
        }
        return color;
    },

    buyPrice : function(){
        return Number(this.stock.buy_price).toFixed(2);
    },

    userTotal : function(){
        if (this.total) {
            return parseInt(this.total);
        } else {
            return "";
        }
    },

    symbol : function(){
        return this.stock.Symbol.toUpperCase();
    },

    action : function(){
        return this.type.toUpperCase();
    }

});


Template.transactionList.events({

    'click .dropdown-menu.users': function (event, template) {
        event.preventDefault();
        $('#usersDropDownBtn').text(event.target.text);
        $(".transaction_list").show();
        var userId = event.target.id;
        var transactions = Transactions.find({user_id : userId}).fetch();
        return template.state.set("userTransactions", transactions);
    }
});
