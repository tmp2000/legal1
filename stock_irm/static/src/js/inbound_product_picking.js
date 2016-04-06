///////////////////////////////////////////////////////////////////////////////
//
//    Author: Samuel Lefever
//    Copyright 2015 Niboo SPRL
//
//    This program is free software: you can redistribute it and/or modify
//    it under the terms of the GNU Affero General Public License as
//    published by the Free Software Foundation, either version 3 of the
//    License, or (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Affero General Public License for more details.
//
//    You should have received a copy of the GNU Affero General Public License
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
///////////////////////////////////////////////////////////////////////////////

(function() {

    var instance = openerp;
    var _t = instance._t,
        _lt = instance._lt;
    var QWeb = instance.qweb;

    var inbound_product_picking = instance.stock_irm.widget.extend({
    	init: function (supplier_id) {
            this._super();
            var self = this;
            self.carts = {};
            self.current_cart = false;
            self.template = 'product_selector';
            self.supplier_id = supplier_id;
            self.received_products = {};
        },
        start: function(){
            var self = this;
            self.$elem = $(QWeb.render(this.template));
            $('#content').html(self.$elem);
            self.search = '';
            self.add_listener_on_search();
            self.add_listeners();
        },
        refresh: function(){
            var self = this;
            $('#content').html(self.$elem);
            self.add_listeners();
            self.add_listener_on_search();
            self.add_listener_on_product();
            self.add_listener_on_more();
        },
        add_listener_on_search: function(){
            var self = this;
            self.$elem.find('#search_bar + span button').click(function (event) {
                self.do_search();
            });
            self.$elem.find('#search_bar').keyup(function (event) {
                if (event.currentTarget.value.length > 5 | event.which == 13) {
                    self.do_search();
                }
            });
        },
        do_search: function(){
            var self = this;
            var search_value = self.$elem.find('#search_bar')[0].value;
            if (self.search != search_value & search_value!== undefined
                    & search_value.length >= 1){
                var self = this;
                self.page = 1;
                self.$elem.find('#results').empty();
                self.search = search_value;
                self.get_products();
            }
        },
        add_listener_on_more: function(){
            var self = this;

            self.$elem.find('#more').click(function(event){
                event.preventDefault();
                self.page += 1;
                self.get_products();
            })
        },
        add_listener_on_product: function($result){
            var self = this;
            if (!$result){
                $result = self.$elem.find('#results');
            }
            $result.find('a').click(function(event){
                var product_id = $(event.currentTarget).attr('data-id');
                var ProductPage = instance.stock_irm.inbound_product_page;
                self.product_page = new ProductPage(self, product_id);
                self.product_page.start();
            })
        },
        add_listener_on_confirm_button: function(){
            var self = this;

            if (_.isEmpty(self.received_products)) {
                self.$nav.find('#confirm a').hide();
            } else {
                self.$nav.find('#confirm a').show();
                self.$nav.off('click.confirm');
                self.$nav.on('click.confirm', '#confirm a', function(event){
                    self.confirm();
                })
            }
        },
        add_listener_on_back_button: function(){
            var self = this;
            self.$nav.find('#back a').show();
            self.$nav.off('click.back');
            self.$nav.on('click.back', '#back a', function(event){
                self.destroy();
                window.location.href = "/inbound_screen";
            })
        },
        get_products: function(){
            var self = this;
            self.session.rpc('/inbound_screen/get_products', {
                supplier_id: self.supplier_id,
                search: self.search,
                page: self.page - 1
            }).then(function(data){
                self.products = data.products;

                if (self.products.length == 1){
                    var product_id = self.products[0].id;
                    var ProductPage = instance.stock_irm.inbound_product_page;
                    self.product_page = new ProductPage(self, product_id);
                    self.product_page.start();
                    return;
                }

                var $result = $(QWeb.render('product_result', {
                    products: self.products,
                }));

                self.add_listener_on_product($result);
                self.$elem.find('#results').append($result);

                self.$elem.find('#more').remove();

                if(data.products_count > data.search_limit * self.page){
                    var $more = $(QWeb.render('result_more', {}));
                    self.$elem.find('#results').append($more);
                    self.add_listener_on_more();
                }
            });
        },
        add_product: function(product_id, qty){
            console.log(qty);

            var self = this;
            var product = {};
            var cart = {};
            var quantity = 0;
            var index;

            if (_.has(self.received_products, product_id)) {
                product = self.received_products[product_id];
            } else {
                self.received_products[product_id] = product;
                self.current_cart.location += 1;
            }

            if (_.has(product, self.current_cart.id)) {
                cart = product[self.current_cart.id];
            } else {
                product[self.current_cart.id] = cart;
            }

            if (!_.isEmpty(cart)){
                index = cart['index'];
                quantity = cart[index];
            } else {
                index = self.current_cart.location;
                cart['index'] = index;
            }
            //if (_.has(cart, self.current_cart.location)) {
            //    quantity = cart[self.current_cart.location];
            //}

            quantity += qty;

            cart[index] = quantity;
        },
        select_location: function(product_id){
            var self = this;

            if (_.has(self.received_products, product_id)) {
                var product = self.received_products[product_id];
                if (_.has(product, self.current_cart.id)) {
                    var cart = product[self.current_cart.id];
                    return cart['index']
                }
            }
            return self.current_cart.location;
        },
        select_cart: function(cart_id, cart_name){
            var self = this;
            var cart = {
                name: cart_name,
                id: cart_id,
                location: 1,
            }

            if (_.has(self.carts, cart_id)) {
                cart = self.carts[cart_id];
            } else {
                self.carts[cart_id] = cart;
            }

            self.current_cart = cart;
        },
        confirm: function() {
            var self = this;

            self.session.rpc('/inbound_screen/process_picking', {
                supplier_id: self.supplier_id,
                pickings: self.received_products,
            }).then(function(data){
                if (data.status == 'ok'){
                    self.show_modal('Picking Confirmed!', 'Wait for redirection...');
                    window.setTimeout(function(){
                        window.location.href = "/inbound_screen";
                    }, 3000);
                } else {
                    self.show_modal('Picking not confirmed.', data.message);
                }
            }).fail(function(data){
                console.log('FAIL');
            });
        },
        process_barcode: function(barcode) {
            var self = this;
            self.search = barcode.replace(/[\n\r]+/g, '');
            self.page = 1;
            self.$elem.find('#results').empty();
            self.get_products();
        },
    });

    instance.stock_irm.inbound_product_picking = inbound_product_picking;

})();
