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

