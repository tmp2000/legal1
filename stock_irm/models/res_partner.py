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


class ResPartner(models.Model):

    _inherit = "res.partner"

    sequence = fields.Integer("Sequence")

    is_in_inbound = fields.Boolean("Appears In Inbound", default=False)


class SupplierInfo(models.Model):

    _inherit = "product.supplierinfo"

    requires_unpack = fields.Boolean("Requires unpacking", default=False)
    requires_relabel = fields.Boolean("Requires re-labelling", default=False)