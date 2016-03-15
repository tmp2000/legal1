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

    var inbound_supplier_selector = instance.stock_irm.widget.extend({
    	init: function () {
            this._super();
            var self = this;

            QWeb.add_template('/stock_irm/static/src/xml/inbound.xml', function(){
                self.start();
            });
            self.template = 'supplier_selector';
        },
        start: function(){
            var self = this;
            self.$elem = $(QWeb.render(this.template));
            $('body').html(self.$elem);

            self.$elem.find('#search').keyup(function(event){
                self.get_suppliers(event.currentTarget.value)
            })
            self.get_suppliers();
        },
        get_suppliers: function(search){
            var self = this;
            self.session.rpc('/inbound_screen/get_suppliers_data', {
                search: search
            }).then(function(data){
                    self.suppliers = data;
                    var $result = $(QWeb.render('supplier_result', {
                            suppliers: self.suppliers
                    }));
                    self.$elem.find('#results').html($result);
                });
        },
    });
    instance.stock_irm.inbound_supplier_selector = new inbound_supplier_selector();

})();