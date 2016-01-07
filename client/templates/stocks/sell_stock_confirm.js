Template.sellStockConfirm.onCreated(function() {
    
    var state = new ReactiveDict;
    state.set("amount", "");
    this.state = state;

    this.value = function() {
        
        var priceString = this.data.stock.LastTradePriceOnly;
        var price = parseFloat(priceString);
        var stockCost = parseInt(state.get("amount")) * price;
        var roundValue = Number((stockCost).toFixed(2));
        return roundValue;
    }
});


Template.sellStockConfirm.onRendered(function(){
    $("#x-error-icon").hide();
    $("#error-msg").hide();
    $("#sell-stock-btn").prop('disabled', true);
});

function showError(msg){
    $(".form-group").addClass('has-error');
    $(".form-group").addClass('has-feedback');
    $("#error-msg").addClass("already");
    $("#x-error-icon").show();
    $("#error-msg").show();
    $("#error-msg").text(msg);
    $("#sell-stock-btn").prop('disabled', true);

}

function hideError(enabledBtn){
    $("#x-error-icon").hide();
    $("#error-msg").hide();
    $(".form-group").removeClass('has-error');
    $(".form-group").removeClass('has-feedback');
    if (enabledBtn !== undefined) {
        if (enabledBtn === true) {
            $("#sell-stock-btn").prop('disabled', false);
        } else if (enabledBtn === false){
            $("#sell-stock-btn").prop('disabled', true);
        }
    }

}



Template.sellStockConfirm.events({
    'input #amount-text': function(event, template) {
        var amount = $("#amount-text").val();
        var amountInt = parseInt(amount);
        var availableStocks = template.data.stock.amount;
        if (!amountInt) {
            hideError(false);
        } else if (amountInt < 0 || availableStocks < amountInt){
            showError("Error")
        } else {
            hideError(true);
        }
        template.state.set("amount", amount);
    },

    'input #value-text': function(event, template) {
        template.state.set("cost", $("#value-text").val());
    },

    'click button.btn.btn-success.sell': function (event, template) {
        event.preventDefault();
        $("#sell-stock-btn").prop('disabled', true);
        var stock_id = this.stock._id;
        var sprint_id = this.sprint._id;
        var amountStr = template.state.get("amount");
        var value = $("#value-text").val();

        if (!amountStr || amountStr === "0" || !value || value === 0){
            showError("Error");
        } else {
            var amount = parseInt(amountStr);

            Meteor.call('sellStock', stock_id, amount, function (err) {
                if (err) {
                    alert(err);
                } else {
                    Router.go('/sprints/' + sprint_id + '/stocks');
                }
            });
        }
    }
});


Template.sellStockConfirm.helpers({
    price : function(){
      return this.stock.LastTradePriceOnly || "";
    },
    avAmount : function () {
        return this.stock.amount || "";
    },
    value: function() {
        return Template.instance().value() || "";
    },
    name: function () {
        return this.stock.Name || "";
    },
    amount: function () {
        return this.stock.amount;
    },
    startingCash: function () {
        var sprint_id = this.sprint._id;
        var sprint = Sprints.findOne({_id: sprint_id});
        var userId = Meteor.userId();
        var userCash = sprint.cash[userId];
        return Number(userCash).toFixed(2);
    }
});


