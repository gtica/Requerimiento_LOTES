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
               this.stock_quant = [];
               var model_stock_quant = {
                    model:  'stock.quant',
                    fields: ['product_id','lot_id', 'qty','location_id'],
                    domain: [["lot_id", "!=", false]],
                    loaded: function(self, stock_quant){
                        self.stock_quant = stock_quant;
                    }
                };
                _posmodel_super.models.push(model_stock_quant);

          },

        update_model: function(line){
            var self = this;
            var product = line.get_product().id;
            var model_stock_quant  = self.stock_quant
            var location_id = self.config.stock_location_id[0];

            var filter_models =  model_stock_quant.filter(function(filter) {
                        return (filter.product_id[0] == product) && (filter.location_id[0] == location_id);
                    });

            if (line){

                var product = line.get_product();

                if(line.has_product_lot){

                    if(line.product.tracking === "serial"){

                        line.pack_lot_lines.each(function(product_serial){

                            // stock_quant lot_name
                            var lot_name = product_serial.attributes.lot_name;

                             //product.qty_available -= line.get_quantity();

                             var filter_product =  filter_models.filter(function(filter) {
                                    return (filter.lot_id[1] == lot_name);
                               });

                             filter_product[0].qty -= filter_product[0].qty;


                        });

                    }else{

                        line.pack_lot_lines.each(function(product_lot){
                            var lot_name = product_lot.attributes.lot_name;
                            var cantidad = product_lot.order_line.quantity;

                            var filter_product =  filter_models.filter(function(filter) {
                                    return (filter.lot_id[1] == lot_name);
                               });

                            filter_product[0].qty -= cantidad;

                        });

                    }

                }

            }

        },
        push_order: function(order){
            var self = this;
            var pushed = _posmodel_super.push_order.call(this, order);


            if (order){

                order.orderlines.each(function(line){

                    self.update_model(line)


                })
            }
            return pushed;
        },


        get_lot: function(product, location_id, stock_quant) {
            var done = new $.Deferred();
            var self = this;
            

                var product_lot = [];

                 if (stock_quant.length) {

                    var filter_models =  stock_quant.filter(function(filter) {
                        return (filter.product_id[0] == product) && (filter.location_id[0] == location_id);
                    });

                    for (var i = 0; i < filter_models.length; i++) {
                        product_lot.push({
                            'lot_name': filter_models[i].lot_id[1],
                            'qty': filter_models[i].qty,
                        });
                    }
                }
                done.resolve(product_lot);

            return done;
        }

    });
   
    models.Order = models.Order.extend({

         add_product: function(product, options){

            //_super_order.add_product.apply(this,arguments);
            if(this._printed){
                this.destroy();
                return this.pos.get_order().add_product(product, options);
             }
            this.assert_editable();
            options = options || {};
            var attr = JSON.parse(JSON.stringify(product));
            attr.pos = this.pos;
            attr.order = this;
            var line = new  models.Orderline({}, {pos: this.pos, order: this, product: product});

            if(options.quantity !== undefined){
                line.set_quantity(options.quantity);
            }
            if(options.price !== undefined){
                line.set_unit_price(options.price);
            }
            if(options.discount !== undefined){
                line.set_discount(options.discount);
            }

            if(options.extras !== undefined){
                for (var prop in options.extras) {
                    line[prop] = options.extras[prop];
                }
            }

            var last_orderline = this.get_last_orderline();
            if( last_orderline && last_orderline.can_be_merged_with(line) && options.merge !== false){
                last_orderline.merge(line);
            }else{
                this.orderlines.add(line);
            }
            this.select_orderline(this.get_last_orderline());

            if(line.has_product_lot){

                 if(line.product.tracking != 'lot'){
                    this.display_lot_popup();
                }

            }

        },
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
                            lot_value.push(product_lot[i].qty);

                        }
                    }else{

                        if (product_lot[i].qty >= compute_lot_lines.order_line.quantity) {
                            lot_name.push(product_lot[i].lot_name);
                            lot_value.push(product_lot[i].qty);

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
