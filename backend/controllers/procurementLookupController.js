const { Op } = require("sequelize");
const {
  productsSchema,
  Service,
  SparePart,
  Consumables,
} = require("../Model/index");

const mapProduct = (p) => ({
  id: p.product_id,
  code: p.product_id,
  name: p.name_ar || p.name_en,
  unit: p.unit_of_measure || "  ",
  price: p.selling_price ?? null,
});

const mapService = (s) => ({
  id: s.id,
  code: s.serviceCode,
  name: s.arabicName || s.englishName,
  unit: s.unit || "service",
  price: s.price ?? null,
});

const mapSpare = (sp) => ({
  id: sp.id,
  code: sp.sparePartCode,
  name: sp.arabicName || sp.englishName,
  unit: "  ",
  price: sp.sellingPrice ?? null,
});

const mapConsumable = (c) => {
  console.log('Consumable data:', JSON.stringify(c, null, 2));
  console.log('UnitTemplate:', c.UnitTemplate);
  
  return {
    id: c.id,
    code: c.code,
    name: c.nameAr || c.nameEn,
    unit: c.UnitTemplate ? c.UnitTemplate.name_ar || c.UnitTemplate.name_en : "  ",
    price: c.unitCost ?? null,
  };
};

class ProcurementLookupController {
  async search(req, res) {
    try {
      const { type, q = "" } = req.query;
      if (!type) return res.status(400).json({ message: "type is required" });

      const like = { [Op.like]: `%${q}%` };
      let results = [];

      if (type === "equipment") {
        const rows = await productsSchema.findAll({
          where: { [Op.or]: [{ name_ar: like }, { name_en: like }, { product_id: like }, { barcode: like }] },
          limit: 20,
          order: [["name_ar", "ASC"]],
        });
        results = rows.map(mapProduct);
      } else if (type === "services") {
        const rows = await Service.findAll({
          where: { [Op.or]: [{ arabicName: like }, { englishName: like }, { serviceCode: like }] },
          limit: 20,
          order: [["arabicName", "ASC"]],
        });
        results = rows.map(mapService);
      } else if (type === "spares") {
        const rows = await SparePart.findAll({
          where: { [Op.or]: [{ arabicName: like }, { englishName: like }, { sparePartCode: like }] },
          limit: 20,
          order: [["arabicName", "ASC"]],
        });
        results = rows.map(mapSpare);
      } else if (type === "materials") {
        const rows = await Consumables.findAll({
          where: { [Op.or]: [{ nameAr: like }, { nameEn: like }, { code: like }] },
          include: [
            {
              model: require("../Model/schema/unitTemplateSchema"),
              as: "UnitTemplate",
              attributes: ["name"]
            }
          ],
          limit: 20,
          order: [["nameAr", "ASC"]],
        });
        results = rows.map(mapConsumable);
      } else {
        return res.status(400).json({ message: "Invalid type" });
      }

      res.json({ data: results });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new ProcurementLookupController();


