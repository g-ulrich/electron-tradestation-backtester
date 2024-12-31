// const {BaseChart} = require('./light-weight-charts/baseChart');
const {DataFrame} = require('./dataframe');
// const {getAverage} =require('trading-signals');

class Backtest{
    constructor(formData){
        this.params = formData;
        this.bindings();
        this.getBars();
        // console.log(new getAverage([1,2,3,4]));
        // this.chart = new BaseChart({...formData, id: "chart1"});
    }

    bindings(){
        
    }

    getBars(){
        window.ts.marketData.getBars(this.params)
        .then(data => {
        $("#submitBtn").empty().append('Submit');
        $("#backtestContainer div").removeClass('d-none');

        this.start(data);
        })
        .catch(error => {
            $("#submitBtn").empty().append('Submit');
            console.error('Error with dynamic fetch:', error);
        });
    }

    safeExec(index, df, bars){
        var code =  this.params.strategyCode;
        try {
            const BUY = "buy";
            const SELL = "sell";
            const HOLD = "hold";
            const getSignal = eval(`(function(){${code}})`);
            return {success: true, signal: getSignal(), error: ""};
        } catch (error) { 
            return {success: false, signal: "hold", error: error.message};
        }
    }

    trade(signal, pos,  row){
            pos?.Trades.push({...row, signal: signal});
            var newQuantity = pos?.Quantity;
            if (signal === "buy"){
                newQuantity += 1;
            } else if (signal === "sell" && newQuantity > 0) {
                newQuantity -= 1;
            }
            // var averagePrice = newQuantity != pos?.Quantity ? 
            var buyTrades = pos?.Trades.filter(trade => {
                if (trade.signal === "buy") {
                    return trade?.Close;
                }
            });
            // console.log();
            return {
                Timestamp: row?.TimeStamp,
                Quantity: newQuantity,
                Last: row?.Close,
                AveragePrice: "",
                // additional keys
                Trades: pos?.Trades
            };
    }
    start(bars){
        let pos = {
            AccountID: "123456789",
            AveragePrice: 0.0,
            AssetType: "STOCK",
            Last: 0.0,
            Bid: 0.0,
            Ask: 0.0,
            ConversionRate: 1,
            DayTradeRequirement: 0,
            InitialRequirement: 0,
            MaintenanceMargin: 0,
            PositionID: "1234",
            LongShort: "Long",
            Quantity: 0,
            Symbol: this.params?.symbol,
            Timestamp: "",
            TodaysProfitLoss: 0.0,
            TotalCost: 0.0,
            MarketValue: 0.0,
            MarkToMarketPrice: 0.0,
            UnrealizedProfitLoss: 0.0,
            UnrealizedProfitLossPercent: 0.0,
            UnrealizedProfitLossQty: 0.0,
            // additional keys
            Trades: []
          };
       

        var start = new Date().getTime();
        var df = new DataFrame(bars);
        for (var i = 0; i < df.length(); i ++) {
            var row = df.getRow(index);
            var bars = df.getRowRange(0, index);
            var resp = this.safeExec(i, df, bars);
            if (resp.signal == "buy" || resp.signal == "sell") {
               pos = this.trade(resp.signal, pos, row);
            }
        }
        var end = new Date().getTime();
        // $("#chart1").empty().append(`
        //     <br/>bars: ${df.length()}
        //     <br/>Total profit: ${totalProfit}
        //     <br/>Total Trades: ${totalTrades}
        //     <br/>Winning Trades: ${winTrades}
        //     <br/>Win Rate: ${winTrades / totalTrades * 100}%
        //     <br/>Final Capital: ${cash + totalProfit}
        //     <br/>Execution Time (ms): ${end - start}
        //     <br/>Execution Time (s): ${(end - start) / 1000}
        //     `);
    }
}

module.exports = {Backtest: Backtest};