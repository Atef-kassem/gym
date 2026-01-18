-- إنشاء جدول حركات المخزون
CREATE TABLE IF NOT EXISTS inventory_movements (
    id SERIAL PRIMARY KEY,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    transaction_type VARCHAR(100) NOT NULL CHECK (
        transaction_type IN (
            'إدخال مشتريات',
            'إدخال مرتجع مبيعات',
            'صرف مبيعات',
            'صرف إنتاج',
            'صرف استهلاك',
            'تحويل داخلي',
            'إدخال تحويل داخلي',
            'تسوية جرد',
            'إدخال تالف',
            'إرجاع لمورد'
        )
    ),
    item_code VARCHAR(100) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    quantity DECIMAL(15,3) NOT NULL,
    uom VARCHAR(50) NOT NULL,
    warehouse VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    doc_ref VARCHAR(100),
    doc_type VARCHAR(100),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    cost DECIMAL(15,2) DEFAULT 0,
    batch_number VARCHAR(100),
    expiry_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    balance_after DECIMAL(15,3) NOT NULL,
    category VARCHAR(100),
    supplier VARCHAR(100),
    risk_level VARCHAR(20) DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
    predicted_demand DECIMAL(15,3),
    seasonal_trend VARCHAR(20) DEFAULT 'stable' CHECK (seasonal_trend IN ('increasing', 'decreasing', 'stable')),
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول الرؤى الذكية
CREATE TABLE IF NOT EXISTS ai_insights (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('trend', 'alert', 'recommendation', 'prediction')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    impact VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (impact IN ('high', 'medium', 'low')),
    confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    action_required BOOLEAN DEFAULT FALSE,
    category VARCHAR(100),
    data JSONB,
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء جدول التنبيهات الذكية
CREATE TABLE IF NOT EXISTS smart_alerts (
    id SERIAL PRIMARY KEY,
    severity VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (severity IN ('critical', 'warning', 'info')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    resolved BOOLEAN DEFAULT FALSE,
    auto_generated BOOLEAN DEFAULT TRUE,
    alert_type VARCHAR(100),
    related_item_id INTEGER,
    related_item_type VARCHAR(100),
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    branch_id INTEGER REFERENCES branches(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء الفهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_inventory_movements_transaction_date ON inventory_movements(transaction_date);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_item_code ON inventory_movements(item_code);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_transaction_type ON inventory_movements(transaction_type);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_warehouse ON inventory_movements(warehouse);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_user_id ON inventory_movements(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_company_id ON inventory_movements(company_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_branch_id ON inventory_movements(branch_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_risk_level ON inventory_movements(risk_level);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_category ON inventory_movements(category);

CREATE INDEX IF NOT EXISTS idx_ai_insights_type ON ai_insights(type);
CREATE INDEX IF NOT EXISTS idx_ai_insights_impact ON ai_insights(impact);
CREATE INDEX IF NOT EXISTS idx_ai_insights_category ON ai_insights(category);
CREATE INDEX IF NOT EXISTS idx_ai_insights_company_id ON ai_insights(company_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_branch_id ON ai_insights(branch_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_created_at ON ai_insights(created_at);

CREATE INDEX IF NOT EXISTS idx_smart_alerts_severity ON smart_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_resolved ON smart_alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_timestamp ON smart_alerts(timestamp);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_company_id ON smart_alerts(company_id);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_branch_id ON smart_alerts(branch_id);
CREATE INDEX IF NOT EXISTS idx_smart_alerts_priority ON smart_alerts(priority);

-- إنشاء trigger لتحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inventory_movements_updated_at 
    BEFORE UPDATE ON inventory_movements 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_insights_updated_at 
    BEFORE UPDATE ON ai_insights 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_smart_alerts_updated_at 
    BEFORE UPDATE ON smart_alerts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إنشاء view للإحصائيات السريعة
CREATE OR REPLACE VIEW inventory_movement_summary AS
SELECT 
    company_id,
    branch_id,
    DATE(transaction_date) as movement_date,
    COUNT(*) as total_movements,
    SUM(CASE WHEN quantity > 0 THEN quantity ELSE 0 END) as total_in,
    SUM(CASE WHEN quantity < 0 THEN ABS(quantity) ELSE 0 END) as total_out,
    SUM(quantity * COALESCE(cost, 0)) as total_value,
    COUNT(DISTINCT item_code) as unique_items,
    COUNT(DISTINCT user_id) as unique_users
FROM inventory_movements 
WHERE is_active = true
GROUP BY company_id, branch_id, DATE(transaction_date);

-- إنشاء view للتنبيهات النشطة
CREATE OR REPLACE VIEW active_alerts_summary AS
SELECT 
    company_id,
    branch_id,
    severity,
    COUNT(*) as alert_count,
    COUNT(CASE WHEN resolved = false THEN 1 END) as unresolved_count
FROM smart_alerts 
WHERE is_active = true
GROUP BY company_id, branch_id, severity;

-- إضافة تعليقات على الجداول
COMMENT ON TABLE inventory_movements IS 'جدول حركات المخزون مع التحليلات الذكية';
COMMENT ON TABLE ai_insights IS 'جدول الرؤى والتحليلات الذكية';
COMMENT ON TABLE smart_alerts IS 'جدول التنبيهات الذكية التلقائية';

-- إضافة تعليقات على الأعمدة المهمة
COMMENT ON COLUMN inventory_movements.risk_level IS 'مستوى المخاطر: منخفض، متوسط، عالي';
COMMENT ON COLUMN inventory_movements.predicted_demand IS 'الطلب المتوقع للصنف';
COMMENT ON COLUMN inventory_movements.seasonal_trend IS 'الاتجاه الموسمي: متزايد، متناقص، مستقر';
COMMENT ON COLUMN ai_insights.confidence IS 'مستوى الثقة في الرؤية (0-100)';
COMMENT ON COLUMN smart_alerts.priority IS 'أولوية التنبيه (1-5، 5 الأعلى)';
