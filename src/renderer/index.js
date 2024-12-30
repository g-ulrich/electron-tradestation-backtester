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
       this.strategies = [];
    this.getStrategies();
    }

    getStrategies(){
        var selectedStrategy = $("#strategySelect option:selected");
        ipcRenderer.once('sendStrategies', (event, arg) => {
            if (arg?.data) {
                this.strategies = arg?.data;
                $("#strategySelect").empty();
                arg.data.forEach((item)=>{
                    $("#strategySelect").append(`<option class="text-white" value="${item?.name}" data-id="${item?.id}" ${$("#strategyName").val() == item?.name ? 'selected' : ''}>${item?.name}</option>`);
                });
                if (arg?.data.length < 1) {
                    this.strategies = [];
                    $("#strategySelect").append(`<option class="text-white" value="New" data-id="_1234" selected>New</option>`);
                    $("#strategyName").val("New");
                    glb_codeEditor.setValue("// Start new Strategy");
                } else {
                    selectedStrategy = $("#strategySelect option:selected");
                $("#strategyName").val(selectedStrategy.text());
                    var matchingObj = arg?.data.filter(strategy => strategy.id === selectedStrategy.attr('data-id'));
                    glb_codeEditor.setValue(matchingObj[0].code);
                }
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
                this.getStrategies();
                setTimeout(()=>{
                    $("#SaveCode").empty();
                    $("#SaveCode").append("Save");
                },700);
            }
        });
        const selectedStrategy = $("#strategySelect option:selected");
        const selectedId = selectedStrategy.attr("data-id");
        var newStrat = $("#strategyName").val() != selectedStrategy.text() ? true : false;
        $("#SaveCode").empty();
        $("#SaveCode").append('<i class="fa-solid fa-spinner fa-spin"></i> Saving...');
        ipcRenderer.send('getSaveStrategy', {id: newStrat ? "" : selectedId, name: $("#strategyName").val(), code: glb_codeEditor.getValue()});
    }

    deleteStrategy(){
        ipcRenderer.once('sendDeleteStreategy', (event, arg) => {
            if (arg?.data) {
                this.getStrategies();
                setTimeout(()=>{
                    $("#DeleteCode").empty();
                    $("#DeleteCode").append("Delete");
                },700);
            }
        });
        const selectedStrategy = $("#strategySelect option:selected");
        const selectedId = selectedStrategy.attr("data-id");
        $("#DeleteCode").empty();
        $("#DeleteCode").append('<i class="fa-solid fa-spinner fa-spin"></i> Deleting...');
        ipcRenderer.send('getDeleteStrategy', {id: selectedId});
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
            self.safeExecuteTest(formData?.code);
            console.log(formData);
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
            $("#SaveCode").addClass('disabled-click');
            setTimeout(() => {
                $("#SaveCode").removeClass('disabled-click');
            }, 700);
        });
        $("#testCode").on('click', ()=>{
            const btnFunc = (passObj) =>{
                $("#testCode").empty();
                $("#testCode").append(`<i class="fa-solid fa-vial ${!passObj ? 'fa-flip' : ''}"></i> ${!passObj ? 'Testing...' : passObj.success ? 'Success' : 'Failure'}`);
                $("#codeErr").text(passObj && passObj.error?.message ? passObj.error?.message : ''); 
                setTimeout(()=>{
                    $("#testCode").empty();
                    $("#testCode").append(`<i class="fa-solid fa-vial"></i> Test`);
                    
                }, 10000);
            }
            btnFunc();
            var code = glb_codeEditor.getValue();
            var pass = self.safeExecuteTest(code);
            setTimeout(()=>{
                btnFunc(pass);
            }, 700);
            $("#testCode").addClass('disabled-click');
            setTimeout(() => {
                $("#testCode").removeClass('disabled-click');
            }, 700);
            
        });
        $("#strategySelect").change(function() {
            const selectedStrategy = $("#strategySelect option:selected");
            const selectedId = selectedStrategy.attr("data-id");
            $("#strategyName").val(selectedStrategy.text());
            var matchingObj = self.strategies.filter(strategy => strategy.id === selectedId);
            glb_codeEditor.setValue(matchingObj[0].code);
          });
        $("#DeleteCode").on('click', ()=>{
            self.deleteStrategy();
            $("#DeleteCode").addClass('disabled-click');
            setTimeout(() => {
                $("#DeleteCode").removeClass('disabled-click');
            }, 700);
        });
    }


}

