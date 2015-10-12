# -*- coding: utf-8 -*-
from openerp import models, fields

from .printing import _available_action_types


class res_users(models.Model):
    _inherit = 'res.users'

    def _user_available_action_types_inherit(self):
        return [(code, string) for code, string
                in _available_action_types(self)
                if code != 'user_default']

    printing_action = fields.Selection(_user_available_action_types_inherit)
    work_location_id = fields.Many2one('work_location', string='Work Location', required=False)