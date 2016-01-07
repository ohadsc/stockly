CUtils = {
    updateStockPricesFromYahoo: function (sprint_id, callback) {
        var ids = StocksUtils.getSprintMembersIds(sprint_id, true);

        var symbols = $.map(Stocks.find({user_id: {$in: ids}, sprint_id: sprint_id}).fetch(), function (stock, i) {
            return stock.symbol;
        });

        Meteor.call('updateStockPrices', symbols, function (err) {
            if (err) {
                alert(err);
            } else {
                if (callback) {
                    callback();
                }
            }
        });
    },

    getUserStocks: function (template, userId) {
        if (!Template.instance().data) return null;
        var sprint_id = Template.instance().data.sprint._id;
        var userStocksId = userId || Meteor.userId();
        return Stocks.find({user_id: userStocksId, sprint_id: sprint_id});
    }
}