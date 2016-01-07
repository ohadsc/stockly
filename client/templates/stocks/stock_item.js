Template.stockItem.helpers({
    domain: function() {
        var a = document.createElement('a');
        a.href = this.url;
        return a.hostname;
    }
});


UI.registerHelper('toUpperCase', function(str) {
    return str.toUpperCase();

});

UI.registerHelper('pChange', function(price, change) {
    return ((change / price) * 100).toFixed(2).toString();

});