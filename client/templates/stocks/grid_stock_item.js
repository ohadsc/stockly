Template.gridStockItem.helpers({
    domain: function() {
        var a = document.createElement('a');
        a.href = this.url;
        return a.hostname;
    },
    value : function(){
        return numWithCommas(Number((this.amount * this.LastTradePriceOnly).toFixed(0)));
    },
    changeColorClass : function () {
        var change = this.Change;
        if (change < 0){
            return "red";
        } else if (change > 0) {
            return "green";
        }
    },
    roiColorClass : function(){
        var diff = this.LastTradePriceOnly - this.buy_price;
        if (diff < 0){
            return "red";
        } else if (diff > 0) {
            return "green";
        }
    },
    currentPrice: function () {
        return Number(this.LastTradePriceOnly).toFixed(1);
    },
    roi : function(){
        var number = (this.LastTradePriceOnly - this.buy_price)/this.buy_price;
        var roi = Number(number * 100).toFixed(2);
        if (roi === "-0.00") {
            roi = roi.replace('-', '');
        }
        var value = Number(this.buy_price * number * this.amount).toFixed(0);

        return Number(roi).toFixed(1).toString() + "% (" + value.toString() + "$)";
    },
    buy : function(){
        return Number(this.buy_price).toFixed(1);
    },
    changeInPercent : function(){
        var currentPrice = parseFloat(this.LastTradePriceOnly);
        var change = parseFloat(this.Change) || 0;
        var initPrice = currentPrice + change;
        var percent = (change / initPrice) * 100;
        return Number(percent).toFixed(2);
    }

});

UI.registerHelper('toUpperCase', function(str) {
    return str.toUpperCase();

});

UI.registerHelper('pChange', function(price, change) {
    return ((change / price) * 100).toFixed(2).toString();

});

UI.registerHelper('isCurrentUser', function(user_id) {
    return Meteor.userId() === user_id;
});

function numWithCommas(x){
    return x.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
}
