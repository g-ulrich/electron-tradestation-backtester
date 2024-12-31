const { createChart, CrosshairMode } =require( "lightweight-charts");
const {CHART_THEMES}  =require(  './options');
const {Legend}  =require('./legend');

class BaseChart{
    constructor(param){
        this.containerId = param?.id || alert("Need id for chart.");
        this.chart = createChart(this.containerId, {...CHART_THEMES.defaultChart});
        $("#tv-attr-logo").hide();
        this._setResizeListener();
        this._setCrosshairListener();
        this.legend = new Legend(this.containerId);
        this.legend.setSymbol(param?.symbol);
        this.setWatermark(`${param?.symbol} ${param?.interval}${param?.unit[0]}`);
    }
    _resizeChart(w, h){
        const $container = $(`#${this.containerId}`);
        var w = w ? w : $container.width();
        var h = h ? h :$container.height();
        this.chart.resize(w, h);
        console.log($container.width(),h);
        return {width: w, height: h};
    }
    _setResizeListener(){ 
        this.chart.applyOptions(this._resizeChart($("#backtestContainer").width()));
        window.addEventListener("resize", ()=>{
            this._resizeChart();
        });
    }
    _setCrosshairListener(){
        this.chart.subscribeCrosshairMove(e => {
            if (e.time !== undefined){
                var series = [];
                e.seriesData.forEach((value, key) => {
                    series.push({...value, title: key._internal__series._private__options.title});
                });
                this.legend.update(this.series, series);
            }
        });
    }
    setWatermark(text, fontSize, color, visible){
        this.chart.applyOptions({watermark: {
            text: text ? text : "",
            fontSize: fontSize ? fontSize : 60,
            color: color ? color : "rgba(256, 256, 256, 0.1)",
            visible: visible ? visible : true
          }});
    }
}

module.exports = {BaseChart: BaseChart};