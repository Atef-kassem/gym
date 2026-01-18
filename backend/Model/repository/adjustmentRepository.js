const { Op } = require("sequelize");
const sequelize = require("../../Config/sequelize");
const Adjustment = require("../schema/adjustmentSchema");
const StockCountSession = require("../schema/stockCountSessionSchema");

class AdjustmentRepository {
  async create(adjustmentData) {
    try {
      console.log("📝 محاولة إنشاء تسوية:", {
        stockCountSessionId: adjustmentData.stockCountSessionId,
        itemCode: adjustmentData.itemCode,
        itemName: adjustmentData.itemName,
        adjustmentType: adjustmentData.adjustmentType,
        quantity: adjustmentData.quantity,
        value: adjustmentData.value,
        reason: adjustmentData.reason
      });

      // التحقق من البيانات المطلوبة
      if (!adjustmentData.stockCountSessionId) {
        throw new Error("stockCountSessionId is required");
      }
      if (!adjustmentData.itemCode) {
        throw new Error("itemCode is required");
      }
      if (!adjustmentData.itemName) {
        throw new Error("itemName is required");
      }
      if (!adjustmentData.adjustmentType) {
        throw new Error("adjustmentType is required");
      }
      if (adjustmentData.quantity === undefined || adjustmentData.quantity === null) {
        throw new Error("quantity is required");
      }
      if (adjustmentData.value === undefined || adjustmentData.value === null) {
        throw new Error("value is required");
      }

      // التحقق من adjustmentType
      const validTypes = ["زائد", "أقفل"];
      if (!validTypes.includes(adjustmentData.adjustmentType)) {
        throw new Error(`Invalid adjustmentType: ${adjustmentData.adjustmentType}. Must be one of: ${validTypes.join(", ")}`);
      }

      // التأكد من أن quantity رقم صحيح
      const quantity = parseInt(adjustmentData.quantity);
      if (isNaN(quantity)) {
        throw new Error(`Invalid quantity: ${adjustmentData.quantity}. Must be a valid integer.`);
      }

      // التأكد من أن value رقم
      const value = parseFloat(adjustmentData.value);
      if (isNaN(value)) {
        throw new Error(`Invalid value: ${adjustmentData.value}. Must be a valid number.`);
      }

      const cleanData = {
        ...adjustmentData,
        quantity,
        value
      };

      console.log("✅ البيانات النظيفة:", cleanData);

      const adjustment = await Adjustment.create(cleanData);
      console.log("✅ تم إنشاء التسوية بنجاح:", adjustment.id);
      return adjustment;
    } catch (error) {
      console.error("❌ خطأ في إنشاء التسوية:", {
        message: error.message,
        name: error.name,
        original: error.original?.message,
        errors: error.errors
      });
      throw new Error(`Error creating adjustment: ${error.message}`);
    }
  }

  async findAll(filters = {}) {
    try {
      const whereClause = {};

      if (filters.stockCountSessionId) {
        whereClause.stockCountSessionId = filters.stockCountSessionId;
      }

      if (filters.status && filters.status !== "all") {
        whereClause.status = filters.status;
      }

      if (filters.searchTerm) {
        whereClause[Op.or] = [
          { adjustmentNumber: { [Op.like]: `%${filters.searchTerm}%` } },
          { itemCode: { [Op.like]: `%${filters.searchTerm}%` } },
          { itemName: { [Op.like]: `%${filters.searchTerm}%` } },
        ];
      }

      const adjustments = await Adjustment.findAll({
        where: whereClause,
        include: [
          {
            model: StockCountSession,
            as: "session",
            attributes: ["sessionNumber", "warehouseId", "date"],
            include: [
              {
                model: require("../schema/warehousesSchema"),
                as: "warehouse",
                attributes: ["warehouse_code"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return adjustments;
    } catch (error) {
      throw new Error(`Error fetching adjustments: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const adjustment = await Adjustment.findByPk(id, {
        include: [
          {
            model: StockCountSession,
            as: "session",
            include: [
              {
                model: require("../schema/warehousesSchema"),
                as: "warehouse",
                attributes: ["warehouse_code"],
              },
            ],
          },
        ],
      });

      if (!adjustment) {
        throw new Error("Adjustment not found");
      }

      return adjustment;
    } catch (error) {
      throw new Error(`Error fetching adjustment: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const [updatedRows] = await Adjustment.update(updateData, {
        where: { id },
      });

      if (updatedRows === 0) {
        throw new Error("Adjustment not found");
      }

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating adjustment: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedRows = await Adjustment.destroy({
        where: { id },
      });

      if (deletedRows === 0) {
        throw new Error("Adjustment not found");
      }

      return true;
    } catch (error) {
      throw new Error(`Error deleting adjustment: ${error.message}`);
    }
  }

  async getStatistics() {
    try {
      const stats = await Adjustment.findAll({
        attributes: [
          [sequelize.fn("COUNT", sequelize.col("id")), "totalAdjustments"],
          [
            sequelize.fn("SUM", sequelize.literal("CASE WHEN status = 'معتمد' THEN 1 ELSE 0 END")),
            "approvedAdjustments",
          ],
          [
            sequelize.fn("SUM", sequelize.literal("CASE WHEN status = 'قيد المراجعة' THEN 1 ELSE 0 END")),
            "pendingAdjustments",
          ],
          [sequelize.fn("SUM", sequelize.col("value")), "totalValue"],
        ],
        raw: true,
      });

      return stats[0];
    } catch (error) {
      throw new Error(`Error fetching adjustment statistics: ${error.message}`);
    }
  }

  async approve(id, approvedBy) {
    try {
      console.log("🔍 محاولة اعتماد التسوية:", { id, approvedBy });
      console.log("🆔 نوع المعرف:", typeof id);
      
      // التأكد من أن id صالح
      if (!id) {
        throw new Error("Adjustment ID is required");
      }
      
      // البحث عن التسوية أولاً للتأكد من وجودها
      const existingAdjustment = await Adjustment.findByPk(id);
      if (!existingAdjustment) {
        throw new Error("Adjustment not found");
      }
      
      console.log("🔍 التسوية الموجودة:", existingAdjustment.id);
      
      // البحث عن المنتج لحساب القيمة الفعلية
      let actualValue = existingAdjustment.value; // القيمة الافتراضية
      
      try {
        // البحث عن المنتج في جدول المنتجات
        const Product = require("../schema/productsSchema");
        const product = await Product.findByPk(existingAdjustment.itemCode);
        
        if (product) {
          // حساب القيمة الفعلية = الكمية × السعر الفعلي
          const actualPrice = product.unit_price || product.cost_price || 0;
          actualValue = Number(existingAdjustment.quantity) * Number(actualPrice);
          
          console.log("💰 حساب القيمة الفعلية للمنتج:", {
            itemCode: existingAdjustment.itemCode,
            quantity: existingAdjustment.quantity,
            actualPrice: actualPrice,
            calculatedValue: actualValue,
            originalValue: existingAdjustment.value
          });
        } else {
          // البحث في قطع   
          try {
            const SparePart = require("../schema/sparePartsSchema");
            const sparePart = await SparePart.findOne({
              where: { sparePartCode: existingAdjustment.itemCode }
            });
            
            if (sparePart) {
              const actualPrice = sparePart.costPrice || 0;
              actualValue = Number(existingAdjustment.quantity) * Number(actualPrice);
              
              console.log("🔧 حساب القيمة الفعلية ل     :", {
                itemCode: existingAdjustment.itemCode,
                quantity: existingAdjustment.quantity,
                actualPrice: actualPrice,
                calculatedValue: actualValue,
                originalValue: existingAdjustment.value
              });
            } else {
              // البحث في المستهلكات
              try {
                const Consumable = require("../schema/consumablesSchema");
                const consumable = await Consumable.findOne({
                  where: { id: existingAdjustment.itemCode }
                });
                
                if (consumable) {
                  const actualPrice = consumable.unitCost || 0;
                  actualValue = Number(existingAdjustment.quantity) * Number(actualPrice);
                  
                  console.log("🧴 حساب القيمة الفعلية للمستهلك:", {
                    itemCode: existingAdjustment.itemCode,
                    quantity: existingAdjustment.quantity,
                    actualPrice: actualPrice,
                    calculatedValue: actualValue,
                    originalValue: existingAdjustment.value
                  });
                } else {
                  console.log("⚠️ الصنف غير موجود في أي جدول، استخدام القيمة الأصلية");
                }
              } catch (consumableError) {
                console.log("⚠️ خطأ في البحث عن المستهلك:", consumableError.message);
              }
            }
          } catch (sparePartError) {
            console.log("⚠️ خطأ في البحث عن قطع   :", sparePartError.message);
          }
        }
      } catch (productError) {
        console.log("⚠️ خطأ في البحث عن المنتج، استخدام القيمة الأصلية:", productError.message);
      }

      // تحديث التسوية مع القيمة الفعلية
      const [updatedRows] = await Adjustment.update(
        {
          status: "معتمد",
          approvedBy,
          approvedAt: new Date(),
          value: actualValue, // تحديث القيمة بالقيمة الفعلية
        },
        {
          where: { id: id },
        }
      );

      console.log("📊 نتيجة التحديث:", { updatedRows });

      if (updatedRows === 0) {
        throw new Error("Adjustment not found");
      }

      // جلب التسوية المحدثة
      const updatedAdjustment = await this.findById(id);
      console.log("✅ تم اعتماد التسوية:", updatedAdjustment);
      
      return updatedAdjustment;
    } catch (error) {
      console.error("❌ خطأ في اعتماد التسوية:", error);
      throw new Error(`Error approving adjustment: ${error.message}`);
    }
  }

  async generateAdjustmentNumber() {
    try {
      const lastAdjustment = await Adjustment.findOne({
        order: [["createdAt", "DESC"]],
      });

      const lastNumber = lastAdjustment ? parseInt(lastAdjustment.adjustmentNumber.split("-").pop()) : 0;

      return `ADJ-${new Date().getFullYear()}-${String(lastNumber + 1).padStart(3, "0")}`;
    } catch (error) {
      throw new Error(`Error generating adjustment number: ${error.message}`);
    }
  }
}

module.exports = new AdjustmentRepository();
