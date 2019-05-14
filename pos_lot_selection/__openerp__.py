# -*- coding: utf-8 -*-
# Copyright 2018 Tecnativa S.L. - David Vidal
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl.html).

{
    'name': 'POS Lot Selection',
    'version': '10.0.1.0.0',
    'category': 'Point of Sale',
    'author': 'Tecnativa,'
              'Odoo Community Association (OCA) && Update Ing Henry Vivas',
    'website': 'https://github.com/OCA/pos',
    'license': 'AGPL-3',
    'description': """
List of modifications / Updates:
----------------------
    * V.-2.0 Permite seleccionar primero el Producto, segundo paso selección de Lote
    * V.-2.1 Al precionar botón de pago, si en la línea de orden existe un producto de lote o serie, no permite procesar factura hasta tanto el usuario seleccione un lote o serail correspondiente
    * V.-2.2 Ventana de alerta si no haz seleccionado un Lote 
    * V.-2.3 En input lista destinado para selecionar lotes, aparece la cantidad de productos en Stock para el Lote en específico
    * V.-2.4 Presentación más amigable en lista de lotes, Nombre de lote y cantidad en Unidades que tiene en Stock
    * V.-2.5 Correción de Error en la Lista de producto tipo serial, no mostraba la lista si la cantidad en la linea de orden era mayor a uno

 """,
    'depends': [
        'point_of_sale',
    ],
    'data': [
        'templates/assets.xml',
    ],
    'qweb': [
        'static/src/xml/pos.xml'
    ],
    'application': False,
    'installable': True,
}
