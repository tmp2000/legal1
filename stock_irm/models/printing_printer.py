# -*- coding: utf-8 -*-
##############################################################################
#
#    Author: Jerome Guerriat
#    Copyright 2015 Niboo SPRL
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################

from openerp import models, api, fields


class PrintingPrinter(models.Model):
    _inherit = 'printing.printer'

    ip_adress = fields.Char("IP adress")
    xx_proxy_id = fields.Many2one(
        comodel_name='printing.proxy',
        string='Print proxy',
    )

class PrintingProxy(models.Model):
    _name = 'printing.proxy'
    _description = 'Proxy for Printing from https to http'

    name = fields.Char(string='Name',required=True)
    proxy_address = fields.Char(string='Proxy Address',required=True)
