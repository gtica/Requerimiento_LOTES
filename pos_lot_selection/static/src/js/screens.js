odoo.define('pos_lot_selection.screens', function (require) {
"use strict";

var screens = require('point_of_sale.screens');
var gui = require('point_of_sale.gui');
var models = require('point_of_sale.models');
var core = require('web.core');

var _t = core._t;


screens.ActionpadWidget.include({

    renderElement: function() {

        var self = this;
        this._super();
        this.$('.pay').click(function(){
            var order = self.pos.get_order();
            var has_valid_product_lot = _.every(order.orderlines.models, function(line){
                return line.has_valid_product_lot();
            });
            if(!has_valid_product_lot){
                self.gui.show_popup('error',{
                    'title': _t('Número de lote/serial vacío'),
                    'body':  _t('Uno o más productos requieren número de lote/serial.'),
                    confirm: function(){
                        self.gui.show_screen('products');
                    },
                });
            }else{
                self.gui.show_screen('payment');
            }
        });
        this.$('.set-customer').click(function(){
            self.gui.show_screen('clientlist');
        });
    }
});


});
