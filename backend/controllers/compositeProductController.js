const { CompositeProduct, CompositeProductItem, Product } = require("../Model");
const appError = require("../utils/appError");

// ✅ إنشاء منتج مركب
exports.createCompositeProduct = async (req, res, next) => {
  try {
    const { name, code, description, unit, isActive, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "يجب إدخال منتجات ومقاديرها" });
    }

    // جلب تفاصيل المنتجات بالـ cost مش السعر
    const productIds = items.map((item) => item.productId);
    const products = await Product.findAll({
      where: { id: productIds },
    });

    // حساب السعر الكلي بالـ cost
    let totalCost = 0;
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ success: false, message: `المنتج برقم ${item.productId} غير موجود` });
      }
      totalCost += product.cost * item.quantity;
    }

    // إنشاء المنتج المركب مع السعر المحسوب من cost
    const compositeProduct = await CompositeProduct.create({
      name,
      code,
      price: totalCost, // السعر النهائي بالـ cost
      description,
      unit,
      isActive,
    });

    const itemRecords = items.map((item) => ({
      compositeProductId: compositeProduct.id,
      productId: item.productId,
      quantity: item.quantity,
    }));
    await CompositeProductItem.bulkCreate(itemRecords);

    res.status(201).json({ success: true, data: compositeProduct, totalCost });
  } catch (error) {
    next(error);
  }
};

// ✅ جلب كل المنتجات المركبة
exports.getAllCompositeProducts = async (req, res) => {
  try {
    const compositeProducts = await CompositeProduct.findAll({
      include: {
        model: CompositeProductItem,
        include: {
          model: Product,
          attributes: ["id", "name", "code"],
        },
      },
    });
    res.json({ success: true, data: compositeProducts });
  } catch (error) {
    console.error("Error fetching composite products:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ جلب منتج مركب واحد بالتفاصيل
exports.getCompositeProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const compositeProduct = await CompositeProduct.findByPk(id, {
      include: {
        model: CompositeProductItem,
        include: {
          model: Product,
          attributes: ["id", "name", "code"],
        },
      },
    });

    if (!compositeProduct) {
      return res.status(404).json({ success: false, message: "Composite product not found" });
    }

    res.json({ success: true, data: compositeProduct });
  } catch (error) {
    console.error("Error fetching composite product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ تعديل منتج مركب
exports.updateCompositeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, price, description, unit, isActive, items } = req.body;

    const compositeProduct = await CompositeProduct.findByPk(id);
    if (!compositeProduct) {
      return res.status(404).json({ success: false, message: "Composite product not found" });
    }

    await compositeProduct.update({ name, code, price, description, unit, isActive });

    if (items && Array.isArray(items)) {
      await CompositeProductItem.destroy({ where: { compositeProductId: id } });

      const newItems = items.map((item) => ({
        compositeProductId: id,
        productId: item.productId,
        quantity: item.quantity,
      }));
      await CompositeProductItem.bulkCreate(newItems);
    }

    res.json({ success: true, message: "Composite product updated" });
  } catch (error) {
    console.error("Error updating composite product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ حذف منتج مركب
exports.deleteCompositeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const compositeProduct = await CompositeProduct.findByPk(id);
    if (!compositeProduct) {
      return res.status(404).json({ success: false, message: "Composite product not found" });
    }

    await CompositeProductItem.destroy({ where: { compositeProductId: id } });
    await compositeProduct.destroy();

    res.json({ success: true, message: "Composite product deleted" });
  } catch (error) {
    console.error("Error deleting composite product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
