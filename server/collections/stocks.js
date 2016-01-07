
Meteor.methods({
    // The method expects a valid IPv4 address
    'getStock': function (symbol) {
        var url = "https://query.yahooapis.com/v1/public/yql?q="
        url += "select * from yahoo.finance.quote where symbol = '" + symbol + "'"
        url += "&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys"
        var response = HTTP.call("GET", url).data;
        return response;
    },

    'addStock': function (symbol, sprint_id, amount) {
        if (!symbol){
            throw new Meteor.Error(500, 'No Symbol');
        }
        if (!amount || amount === 0 || amount < 0) {
            throw new Meteor.Error(500, 'Amount Error');
        }
        var stocks = Stocks.find({user_id: Meteor.userId(), sprint_id: sprint_id, symbol : symbol}).fetch();
        var stock = null;
        if (stocks.length == 0) {
            stocks = API.getStocksFromYahoo([symbol]);
            stock = stocks[0];
            stock.sprint_id = sprint_id;
            stock.user_id = Meteor.userId();
            stock.url = "http://finance.yahoo.com/q?s=" + stock.symbol;
            stock.amount = 0;
            stock.buy_price = stock.LastTradePriceOnly;
        } else {
            stock = stocks[0];
            amount = parseInt(amount);
            stock.buy_price = (stock.amount*stock.buy_price + amount*stock.LastTradePriceOnly)/(stock.amount + amount);
        }
        stock.amount += parseInt(amount);

        var sprint = Sprints.findOne({_id: sprint_id});
        var userId = Meteor.userId();
        var cashBefore = sprint.cash[userId];
        var cost = amount * stock.LastTradePriceOnly;
        var cashAfter = cashBefore - cost;
        if (cashAfter < 0 ){
            throw new Meteor.Error(500, 'Not enough cash');
        } else {
            sprint.cash[userId] = cashAfter;
            Sprints.update({_id: sprint_id}, sprint);
            Stocks.update({_id: stock._id}, stock, {upsert: true});
            var total = StocksUtils.calcTotal(userId, sprint._id);
            Transactions.insert({
                user_id : userId,
                type : "buy",
                amount : amount,
                price: stock.LastTradePriceOnly,
                value: cost,
                cash_before : cashBefore,
                cash_after: cashAfter,
                stock: stock,
                sprint: sprint,
                date: new Date(),
                total: total
            });
        }
    },

    'updateStockPrices' : function(symbols){
        if (!symbols || symbols.length==0){
            return [];
        } else {
            var stocks = API.getStocksFromYahoo(symbols);
            for (var i = 0; i < stocks.length; i++) {
                Stocks.update(
                    { $or: [ { symbol: stocks[i].symbol.toLowerCase() },
                             { Symbol: stocks[i].symbol.toLowerCase() },
                             { symbol: stocks[i].symbol.toUpperCase() },
                             { symbol: stocks[i].symbol.toUpperCase() },
                             { symbol: stocks[i].symbol.toLowerCase().capitalize() },
                             { Symbol: stocks[i].symbol.toLowerCase().capitalize() },

                    ] },
                    {$set:
                    {'LastTradePriceOnly': stocks[i].LastTradePriceOnly,
                        'Change': stocks[i].Change
                    }},
                    {multi:true}
                );

            }
        }
    },

    'sellStock' : function(stock_id, amount){
        var stock = Stocks.findOne({_id: stock_id});
        if (!amount || amount === 0 || amount < 0 || amount > stock.amount) {
            throw new Meteor.Error(500, 'Error');
        }
        var sprint = Sprints.findOne({_id: stock.sprint_id});
        var userId = Meteor.userId();
        var cashBefore = sprint.cash[userId];
        var value = amount * stock.LastTradePriceOnly;

        if (!value || value === 0 || value < 0) {
            throw new Meteor.Error(500, 'Error');
        }
        var cashAfter = cashBefore + value;
        sprint.cash[userId] = cashAfter;
        Sprints.update({_id: stock.sprint_id}, sprint);
        if (amount === stock.amount){
            Stocks.remove({_id: stock._id});
        } else {
            stock.amount = stock.amount - amount;
            Stocks.update({_id: stock._id}, stock);
        }
        var total = StocksUtils.calcTotal(userId, sprint._id);
        Transactions.insert({
            user_id : userId,
            type : "sell",
            amount : amount,
            price: stock.LastTradePriceOnly,
            value: value,
            cash_before : cashBefore,
            cash_after: cashAfter,
            stock: stock,
            sprint: sprint,
            date: new Date(),
            total : total

        });
    }
});

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}