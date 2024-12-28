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

    safeExecute(code) {
        try {
            return eval(code);
        } catch (error) {
            console.error("Error executing code:", error);
            return null;
        }
    }

    formBindings(){
        const self = this;
        $('#stockForm').submit(function(e) {
            e.preventDefault();
            var formData = {};
            $('#stockForm').find('*[id]').each(function() {
                var id = $(this).attr('id');
                formData[id] = $(`#${id}`).val();
            });
            formData['code'] = glb_codeEditor.getValue();
            console.log(formData);
            self.safeExecute(formData?.code);
            self.formData = formData
        });
    }


}

