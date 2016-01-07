API = {
    getStocksFromYahoo: function (symbols) {
        symbols = symbols.map(function (symbol) {
            return "'" + symbol + "'";
        });
        symbols = symbols.toString();
        var url = "https://query.yahooapis.com/v1/public/yql?q="
        url += "select * from yahoo.finance.quote where symbol in (" + symbols + ")"
        url += "&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys"
        var res = HTTP.call("GET", url).data;
        var stocks = null;
        if (res.query.results) {
            if (res.query.count == 1) {
                stocks = [res.query.results.quote];
            } else {
                stocks = res.query.results.quote;
            }
        } else {
            console.log("Update stocks failed");
        }
        return stocks;
    }

}