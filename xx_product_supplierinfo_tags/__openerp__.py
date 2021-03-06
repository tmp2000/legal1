{
    "name": "Product Supplier Info Tags Customization",
    "version": "1.0",
    "depends": [
        "product",
        "stock",
        "sale",
        "product_manufacturer",
        "xx_tags",
    ],
    "description": "Makes it possible to add tags to Product Supplier Info",
    "author": "DynApps",
    "category": "DynApps/Customizations",
    "website": "http://www.dynapps.be",
    "data": [
        "security/ir.model.access.csv",
        "view/tags_view.xml",
        "view/sale_order_view.xml",
        "view/purchase_order_view.xml",

    ],
    "demo": [
        "demo/product_supplierinfo.yml"],
    'test': [],
    "installable": True,
    "auto_install": False,
}
