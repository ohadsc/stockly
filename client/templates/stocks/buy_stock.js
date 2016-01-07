Template.buyStock.onCreated(function() {
    var state = new ReactiveDict;
    this.state = state;
    state.set("cost", "");
    state.set("companies", []);

    var template = Template.instance();
    Meteor.subscribe('companies', function(){
        var companies = Companies.find().fetch().map(function (company) {
            return !company ? undefined : company.name + " (" + company.symbol + ")";
        });
        template.state.set("companies", companies);
        $(".spinner-wrapper").hide();
    });

    this.amount = function(){
        if (!Session.get("stock")) return 0;
        var priceString = Session.get("stock").LastTradePriceOnly;
        var price = parseFloat(priceString);
        var stockAmount = state.get("cost") / price;
        var stockAmount = parseInt(stockAmount);
        return stockAmount;
    }
    this.actualCost = function(){
        if (!Session.get("stock")) return 0;
        var amount = this.amount();
        var priceString = Session.get("stock").LastTradePriceOnly;
        var price = parseFloat(priceString);
        return Number(amount * price).toFixed(2);

    }
    this.cash = function(){
        if (!Session.get("stock")) return 0;
        var priceString = Session.get("stock").LastTradePriceOnly;
        var price = parseFloat(priceString);
        var userCash = this.openingCash();
        var amount = this.amount();
        var cost = price * amount;
        var cashLeft = parseFloat(userCash) - cost;
        return Number(cashLeft).toFixed(2);
    }
    this.openingCash = function(){
        var sprint_id = this.data.sprint._id;
        var sprint = Sprints.findOne({_id: sprint_id});
        var userId = Meteor.userId();
        var userCash = sprint.cash[userId];
        return Number(userCash).toFixed(2);
    }

});

Template.buyStock.events({
    'submit .create': function(event, template) {
        event.preventDefault();
        $(".find-spinner").show();
        var text = $("#symbol-text").val();
        var symbol = text.substring(text.lastIndexOf("(")+1,text.lastIndexOf(")"));
        if (symbol === ""){
            symbol = text;
        }
        Meteor.call('getStock', symbol, function(err,res){
            $(".find-spinner").hide();
            if (!err && res.query.count !==0 && res.query.results.quote.LastTradePriceOnly){
                var stock = res.query.results.quote;
                $(".stock-details").show();
                $("#add-stock-btn").show();
                $(".buy-stock-amount").show();
                Session.set("stock", stock);
            } else {
                $(".form-group").addClass('has-error');
                $(".form-group").addClass('has-feedback');
                $("#x-error-icon").show();
                $("#error-msg").show();
                $("#error-msg").text("Not Found");
                $(".buy-stock-amount").hide();

            }
        });
    },

    'keyup #symbol-text': function(event) {
        var text = event.target.value;
        if (event.which !== 13) {
            $(".stock-details").hide();
            $("#add-stock-btn").hide();
            $("#x-error-icon").hide();
            $("#error-msg").hide();
            $(".buy-stock-amount").hide();
            $(".form-group").removeClass('has-error');
            $(".form-group").removeClass('has-feedback');
            $("#error-msg").removeClass("already");
        }
    },

    'keyup #cost-text': function(event) {
        var cashLeft = Template.instance().cash();
        var actualCost = parseFloat($('#actual-cost-text').val());
        var cost = parseFloat($('#cost-text').val());
        var amount = parseInt($('#amount-text').val());
        if (!amount || amount < 0 ||
            !cashLeft || cashLeft < 0 ||
            !actualCost || actualCost === 0|| actualCost < 0 ||
            !cost || cost < 0){
            $("#add-stock-btn").prop('disabled', true);
            if (cost < 0 || cost > 999) {
                markError("Error");
            }
        } else {
            removeError();
            $("#add-stock-btn").prop('disabled', false);
        }
    }
});

function check(){
    return !!Session.get("stock");
}

Template.buyStock.helpers({
    startingCash: function () {
        return Template.instance().openingCash();
    },
    cash: function() {
        return Template.instance().cash();
    },
    amount: function() {
        return Template.instance().amount();
    },
    actualCost : function() {
        return Template.instance().actualCost();
    },
    cost: function() {
        return Template.instance().state.get("cost");
    },
    symbol: function () {
        if (!check()) return "";
        var symbol = Session.get("stock").Symbol;
        return symbol ? symbol.toUpperCase() : "";
    },

    price: function () {
        if (!check()) return "";
        var price = Session.get("stock").LastTradePriceOnly;
        return price || "";
    },

    url : function(){
        if (!check()) return "";
        var symbol = Session.get("stock").Symbol;
        return symbol ? "http://finance.yahoo.com/q?s=" + symbol : "";
    },

    cap: function () {
        if (!check()) return "";
        var cap = Session.get("stock").MarketCapitalization;
        return cap || "";
    },
    name: function () {
        if (!check()) return "";
        return Session.get("stock").Name;
    },
    dayLow: function () {
        if (!check()) return "";
        var low = Session.get("stock").DaysLow;
        return low || "";
    },

    dayHigh: function () {
        if (!check()) return "";
        var high = Session.get("stock").DaysHigh;
        return high || "";
    },
    change: function () {
        if (!check()) return "";
        var stock = Session.get("stock");
        if (!stock) {
            return "";
        } else {
            var endDayPrice = parseFloat(stock.LastTradePriceOnly);
            var change = parseFloat(stock.Change);
            var initPrice = endDayPrice - change;
            var percent = (change / initPrice) * 100;
            return Number(percent).toFixed(2);
        }
    },
    companies : function(){
        return Template.instance().state.get("companies");
    }

});

Template.buyStock.onRendered(function (template) {
    Meteor.typeahead.inject();
    Session.set("stock", new Object());
    $("#add-stock-btn").prop('disabled', true);
    $(".stock-details").hide();
    $("#add-stock-btn").hide();
    $(".find-spinner").hide();
    $(".buy-spinner").hide();
    $("#x-error-icon").hide();
    $("#error-msg").hide();
});

/*Template.buyStock.rendered = function() {

}*/

Template.buyStock.events({
    'click button.btn.btn-success': function (event) {
        event.preventDefault();
        $("#add-stock-btn").prop('disabled', true);
        $(".buy-spinner").show();
        var sprint_id = this.sprint._id;
        var stock = Session.get("stock")
        var symbol = stock.Symbol;
        var amount = $("#amount-text").val();

        if (!amount || amount === 0 || amount === "0"){
            markError("Amount Error");
        } else {
            Meteor.call('addStock', symbol, sprint_id, amount, function (err, res) {
                $(".buy-spinner").hide();
                if (err) {
                    markError(err.reason);
                } else {
                    Router.go('/sprints/' + sprint_id + '/stocks');
                }
            });
        }
    }
});

Template.buyStock.events({
    'input #amount-text': function(event, template) {
        template.state.set("amount", $("#amount-text").val());
    },

    'input #cost-text': function(event, template) {
        template.state.set("cost", $("#cost-text").val());
    }
});

function markError(reason){
    $(".form-group").addClass('has-error');
    $(".form-group").addClass('has-feedback');
    $("#error-msg").addClass("already");
    $("#x-error-icon").show();
    $("#error-msg").show();
    $("#error-msg").text(reason);
}

function removeError(){
    $("#x-error-icon").hide();
    $("#error-msg").hide();
    $(".form-group").removeClass('has-error');
    $(".form-group").removeClass('has-feedback');
}

function getSubStr(str, delim) {
    var a = str.indexOf(delim);
    if (a == -1)
        return '';
    var b = str.indexOf(delim, a+1);
    if (b == -1)
        return '';
    return str.substr(a+1, b-a-1);
    //                 ^    ^- length = gap between delimiters
    //                 |- start = just after the first delimiter
}