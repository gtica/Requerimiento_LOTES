/* Copyright 2018 Tecnativa - David Vidal
   License LGPL-3.0 or later (https://www.gnu.org/licenses/lgpl). */

odoo.define("pos_lot_selection.models", function (require) {
    "use strict";

    var models = require("point_of_sale.models");
    var Model = require("web.DataModel");
    var session = require("web.session");
    var _super_order = models.Order.prototype;

    models.PosModel = models.PosModel.extend({
        get_lot: function(product, location_id) {
            var done = new $.Deferred();
            session.rpc("/web/dataset/search_read", {
                "model": "stock.quant",
                "domain": [
                    ["location_id", "=", location_id],
                    ["product_id", "=", product],
                    ["lot_id", "!=", false]],
            }, {'async': false}).then(function (result) {
                var product_lot = [];
                if (result.length) {
                    for (var i = 0; i < result.length; i++) {
                        product_lot.push({
                            'lot_name': result.records[i].lot_id[1],
                            'qty': result.records[i].qty,
                        });
                    }
                }
                done.resolve(product_lot);
            });
            return done;
        },
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

            //console.log('--------------------' + line.has_product_lot)

            if(line.has_product_lot){
                //console.log(line.product.tracking)

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
            this.pos.get_lot(this.product.id, this.pos.config.stock_location_id[0])
            .then(function (product_lot) {
                var lot_name = [];
                var lot_value = [];

                for (var i = 0; i < product_lot.length; i++) {
                    if (product_lot[i].qty >= compute_lot_lines.order_line.quantity) {
                        lot_name.push(product_lot[i].lot_name);
                        lot_value.push(product_lot[i].qty);
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
