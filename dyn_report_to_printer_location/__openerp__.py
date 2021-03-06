# -*- encoding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2015 Dynapps <http://www.dynapps.be>
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

{
    'name': 'Report to printer location',
    'version': '8.0.1.0.0',
    'category': 'Tools',
    'author': 'Dynapps',
    'depends': ['base_report_to_printer','stock'],
    'data': [
        'views/res_users.xml',
        'views/work_location.xml',
        'views/ir_report.xml',
        'views/printing_view.xml',
        'security/security.xml',
        'data/printing_action.xml',
    ],
    'installable': True,
}
