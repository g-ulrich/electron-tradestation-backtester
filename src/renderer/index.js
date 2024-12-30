const {AccountDoughnutChart, PositionsPieChart} = require("./chartjs/pies");
const {randNum, formatVolume, isMarketOpen, getRandomBoldRGBA} = require('./util');
const {SimpleTableData} = require('./datatables/simple');
const { getOrderColumns } = require('./datatables/myColumns/orders');


$(()=>{
    $('body div').hide();
    $('body loader').show();
    window.ts.refreshToken()
    .then(() => {
        new Main();
        $('body div').show();
        $('body loader').fadeOut();
    }).catch(error => {
        console.log(error);
        $('body loader').fadeOut();
    });
});

class Main {
    constructor(){
       this.formBindings();
       this.formData = null;
       
        ipcRenderer.once('sendStrategies', (event, arg) => {
             if (arg?.data) {
               console.log(arg.data);
             } else {
               console.log(arg);
             }
           });
           ipcRenderer.send('getStrategies');
    }

    safeExecuteTest(code) {
        try {
            const buy = "buy";
            const sell = "sell";
            const hold = "hold";
            eval(code);
            return {success: true, error: ""};
        } catch (error) {
            return {success: false, error: error};
        }
    }

    saveStrategy(){
        ipcRenderer.once('sendSaveStreategy', (event, arg) => {
            if (arg?.data) {
                console.log(arg.data);
            } else {
                console.log(arg);
            }
        });
        ipcRenderer.send('getSaveStrategy', {name: "testing", code: glb_codeEditor.getValue()});
    }

    formBindings(){
        const self = this;
        $('#stockForm').submit(function(e) {
            e.preventDefault();
            var formData = {};
            $('#stockForm').find('*[id]').each(function() {
                var id = $(this).attr('id');
                if (id == "strategyCode"){
                    formData[id] = glb_codeEditor.getValue();
                } else {
                    formData[id] = $(`#${id}`).val();
                }
                
            });
            console.log(formData);
            self.safeExecute(formData?.code);
            self.formData = formData
        });

        $("#strategyCodeInfo").on('click', ()=>{
            alert(`/**
* Avaiable strategy variables and information.
*
* @param {String} buy - "buy"
* @param {String} sell - "sell"
* @param {String} hold - "hold"
* @param {Object} df - The historical dataframe 
*               @param {String} Open
*               @param {String} High
*               @param {String} Low
*               @param {String} Close
*               @param {String} TotalVolume
*               @param {String} Timestamp 
*               @param {Integer} Epoch - (e.g. 1604523600000)
*               @param {Integer} TotalTicks
*               @param {Integer} DownTicks
*               @param {Integer} UpTicks
*               @param {Integer} UpVolume
*               @param {Integer} DownVolume
* @param {Object} pos - The current position {}
* returns {String} buy sell or hold
*/`);
        });
        $("#SaveCode").on('click', ()=>{
            self.saveStrategy();
        });
        $("#testCode").on('click', ()=>{
            const btnFunc = (passObj) =>{
                $("#testCode").empty();
                $("#testCode").append(`<i class="fa-solid fa-vial ${!passObj ? 'fa-flip' : ''}"></i> ${!passObj ? 'Testing...' : passObj.success ? 'Success' : 'Failure'}`);
                $("#codeErr").text(passObj && passObj.error?.message ? passObj.error?.message : ''); 
                setTimeout(()=>{
                    $("#testCode").empty();
                    $("#testCode").append(`<i class="fa-solid fa-vial"></i> Test`);
                    $("#codeErr").text(''); 
                }, 10000);
            }
            btnFunc();
            var code = glb_codeEditor.getValue();
            var pass = self.safeExecuteTest(code);
            setTimeout(()=>{
                btnFunc(pass);
            }, 700);
        });
    }


}

