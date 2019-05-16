/* Copyright 2018 Tecnativa - David Vidal
   License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl). */

odoo.define("pos_lot_selection.models", function (require) {
    "use strict";

    var models = require("point_of_sale.models");
    var Model = require("web.DataModel");
    var session = require("web.session");

    var _posmodel_super = models.PosModel.prototype;


    models.PosModel = models.PosModel.extend({

          initialize: function(session, attributes) {
               _posmodel_super.initialize.apply(this, arguments);
               this.stock_quant = []
               var model_stock_quant = {
                    model:  'stock.quant',
                    fields: ['product_id','lot_id', 'qty','name','location_id'],
                    domain: [["lot_id", "!=", false]],
                    loaded: function(self, stock_quant){
                        self.stock_quant = stock_quant;
                    }
                };
                _posmodel_super.models.push(model_stock_quant);

               //console.log('_posmodel_super,models',  _posmodel_super.models)
         },

        get_lot: function(product, location_id, stock_quant) {
            var done = new $.Deferred();
            var self = this;
            var product_id = product;
            var location_id = location_id;
            console.log('stock_quant', stock_quant)
                var product_lot = [];

                //console.log('location_id', stock_quant)
                if (stock_quant.length) {

                    var filter_models =  stock_quant.filter(function(filter) {
                        return (filter.product_id[0] == product) && (filter.location_id[0] == location_id);
                    });

                    //console.log('filter_models',filter_models)

                    for (var i = 0; i < filter_models.length; i++) {
                        if(stock_quant[i].product_id[0] === product && stock_quant[i].location_id[0] === location_id ){
                            product_lot.push({
                                'lot_name': result.records[i].lot_id[1],
                                'qty': result.records[i].qty,
                                'lot_qty': result.records[i].name
                            });
                         }
                    }
                }
                done.resolve(product_lot);

            return done;
        }

    });

    var _orderline_super = models.Orderline.prototype;
    models.Orderline = models.Orderline.extend({
        compute_lot_lines: function(){
            var done = new $.Deferred();
            var compute_lot_lines = _orderline_super.compute_lot_lines.apply(this, arguments);


            this.pos.get_lot(this.product.id, this.pos.config.stock_location_id[0], this.pos.stock_quant)
            .then(function (product_lot) {
                var lot_name = [];
                var lot_value = [];
                var type_lot = compute_lot_lines.order_line.product.tracking;

                for (var i = 0; i < product_lot.length; i++) {

                    if(type_lot == 'serial'){
                       //Lista de producto serial disponibles
                        if (product_lot[i].qty != 0) {
                            lot_name.push(product_lot[i].lot_name);
                            lot_value.push(product_lot[i].lot_qty);
                        }
                    }else{

                        if (product_lot[i].qty >= compute_lot_lines.order_line.quantity) {
                            lot_name.push(product_lot[i].lot_name);
                            lot_value.push(product_lot[i].lot_qty);
                        }
                    }

                }

                compute_lot_lines.lot_name = lot_name;
                compute_lot_lines.lot_value = lot_value;

                done.resolve(compute_lot_lines);
            });
            return compute_lot_lines;
        },
    });

});
