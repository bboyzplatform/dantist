//Костыль для "умного" принта без @media print
dentalToPrint: function(){
         var $printClone = $('<div class="BSDentalGrid print-view"></div>');
         printTable = this.$control.find('.dental-card-table').clone();
         //this.$control.find('.history-list').clone().appendTo($printClone);
         $printClone.append(printTable);
         
        $legend = $('.collapse-legend-container', this.$control).clone();
        $printClone.append($legend);
         
         var $histPrintList = $('<div class="hist-print"></div>');
         var servicesHistData = this.dentalData.customer.serviceHistory;
         for (var serviceString in servicesHistData) {
             var $histBlock = $('<div></div>').css('display', 'inline-block');

             for (var item in servicesHistData[serviceString]) {
                 $histBlock.append('<div><b>' + item + ': <span>' + servicesHistData[serviceString][item]+ '</span></div>');
             }
             $histPrintList.append($histBlock);
         }
         
         $printClone.append($histPrintList);
         
         $('body').append($printClone);
    },