BEGIN;

CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Running upgrade  -> 0001_initial_postgres_schema

CREATE TABLE users (
    id SERIAL NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    full_name VARCHAR(255) NOT NULL, 
    phone VARCHAR(50), 
    initials VARCHAR(12) DEFAULT 'U' NOT NULL, 
    role VARCHAR(30) DEFAULT 'viewer' NOT NULL, 
    password_hash VARCHAR(512) NOT NULL, 
    is_active BOOLEAN DEFAULT true NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE INDEX ix_users_email ON users (email);

CREATE INDEX ix_users_role ON users (role);

CREATE INDEX ix_users_is_active ON users (is_active);

CREATE TABLE refresh_tokens (
    id SERIAL NOT NULL, 
    user_id INTEGER NOT NULL, 
    jti VARCHAR(64) NOT NULL, 
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    revoked BOOLEAN DEFAULT false NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    CONSTRAINT uq_refresh_tokens_jti UNIQUE (jti), 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX ix_refresh_tokens_user_id ON refresh_tokens (user_id);

CREATE INDEX ix_refresh_tokens_jti ON refresh_tokens (jti);

CREATE INDEX ix_refresh_tokens_expires_at ON refresh_tokens (expires_at);

CREATE INDEX ix_refresh_tokens_revoked ON refresh_tokens (revoked);

CREATE TABLE categories (
    id SERIAL NOT NULL, 
    name VARCHAR(120) NOT NULL, 
    PRIMARY KEY (id), 
    CONSTRAINT uq_categories_name UNIQUE (name)
);

CREATE INDEX ix_categories_name ON categories (name);

CREATE TABLE products (
    id SERIAL NOT NULL, 
    public_id VARCHAR(40) NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    sku VARCHAR(100) NOT NULL, 
    unit_price NUMERIC(15, 2) DEFAULT '0' NOT NULL, 
    stock INTEGER DEFAULT '0' NOT NULL, 
    status VARCHAR(30) DEFAULT 'active' NOT NULL, 
    units_sold INTEGER DEFAULT '0' NOT NULL, 
    revenue NUMERIC(18, 2) DEFAULT '0' NOT NULL, 
    growth NUMERIC(8, 2) DEFAULT '0' NOT NULL, 
    category_id INTEGER NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    CONSTRAINT uq_products_public_id UNIQUE (public_id), 
    CONSTRAINT uq_products_sku UNIQUE (sku), 
    FOREIGN KEY(category_id) REFERENCES categories (id)
);

CREATE INDEX ix_products_public_id ON products (public_id);

CREATE INDEX ix_products_name ON products (name);

CREATE INDEX ix_products_sku ON products (sku);

CREATE INDEX ix_products_status ON products (status);

CREATE INDEX ix_products_category_id ON products (category_id);

CREATE TABLE customers (
    id SERIAL NOT NULL, 
    public_id VARCHAR(40) NOT NULL, 
    full_name VARCHAR(255) NOT NULL, 
    email VARCHAR(255), 
    phone VARCHAR(50), 
    city VARCHAR(100), 
    segment VARCHAR(60) DEFAULT 'New' NOT NULL, 
    display_created_at VARCHAR(30), 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    CONSTRAINT uq_customers_public_id UNIQUE (public_id), 
    CONSTRAINT uq_customers_email UNIQUE (email)
);

CREATE INDEX ix_customers_public_id ON customers (public_id);

CREATE INDEX ix_customers_full_name ON customers (full_name);

CREATE INDEX ix_customers_email ON customers (email);

CREATE INDEX ix_customers_city ON customers (city);

CREATE INDEX ix_customers_segment ON customers (segment);

CREATE INDEX ix_customers_created_at ON customers (created_at);

CREATE TABLE orders (
    id SERIAL NOT NULL, 
    public_id VARCHAR(40) NOT NULL, 
    customer_id INTEGER NOT NULL, 
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, 
    total_amount NUMERIC(18, 2) NOT NULL, 
    payment_method VARCHAR(80) DEFAULT 'آنلاین' NOT NULL, 
    city VARCHAR(100), 
    display_date VARCHAR(30), 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    CONSTRAINT uq_orders_public_id UNIQUE (public_id), 
    FOREIGN KEY(customer_id) REFERENCES customers (id)
);

CREATE INDEX ix_orders_public_id ON orders (public_id);

CREATE INDEX ix_orders_customer_id ON orders (customer_id);

CREATE INDEX ix_orders_status ON orders (status);

CREATE INDEX ix_orders_city ON orders (city);

CREATE INDEX ix_orders_created_at ON orders (created_at);

CREATE TABLE order_items (
    id SERIAL NOT NULL, 
    order_id INTEGER NOT NULL, 
    product_id INTEGER NOT NULL, 
    quantity INTEGER DEFAULT '1' NOT NULL, 
    unit_price NUMERIC(15, 2) NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(order_id) REFERENCES orders (id) ON DELETE CASCADE, 
    FOREIGN KEY(product_id) REFERENCES products (id)
);

CREATE INDEX ix_order_items_order_id ON order_items (order_id);

CREATE INDEX ix_order_items_product_id ON order_items (product_id);

CREATE TABLE notifications (
    id SERIAL NOT NULL, 
    user_id INTEGER NOT NULL, 
    type VARCHAR(40) DEFAULT 'info' NOT NULL, 
    title VARCHAR(255) NOT NULL, 
    message VARCHAR(1000) NOT NULL, 
    display_time VARCHAR(80) DEFAULT 'اکنون' NOT NULL, 
    read BOOLEAN DEFAULT false NOT NULL, 
    route VARCHAR(255) DEFAULT '/' NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX ix_notifications_user_id ON notifications (user_id);

CREATE INDEX ix_notifications_read ON notifications (read);

CREATE INDEX ix_notifications_created_at ON notifications (created_at);

CREATE TABLE dashboard_kpis (
    id SERIAL NOT NULL, 
    total_revenue NUMERIC(18, 2) DEFAULT '0' NOT NULL, 
    total_orders INTEGER DEFAULT '0' NOT NULL, 
    net_profit NUMERIC(18, 2) DEFAULT '0' NOT NULL, 
    total_customers INTEGER DEFAULT '0' NOT NULL, 
    average_order_value NUMERIC(18, 2) DEFAULT '0' NOT NULL, 
    conversion_rate NUMERIC(8, 2) DEFAULT '0' NOT NULL, 
    revenue_growth NUMERIC(8, 2) DEFAULT '0' NOT NULL, 
    orders_growth NUMERIC(8, 2) DEFAULT '0' NOT NULL, 
    profit_growth NUMERIC(8, 2) DEFAULT '0' NOT NULL, 
    customers_growth NUMERIC(8, 2) DEFAULT '0' NOT NULL, 
    aov_growth NUMERIC(8, 2) DEFAULT '0' NOT NULL, 
    conversion_growth NUMERIC(8, 2) DEFAULT '0' NOT NULL, 
    PRIMARY KEY (id)
);

CREATE TABLE sales_trend (
    id SERIAL NOT NULL, 
    sort_order INTEGER NOT NULL, 
    label VARCHAR(80) NOT NULL, 
    revenue NUMERIC(18, 2) NOT NULL, 
    profit NUMERIC(18, 2) NOT NULL, 
    orders INTEGER NOT NULL, 
    PRIMARY KEY (id)
);

CREATE INDEX ix_sales_trend_sort_order ON sales_trend (sort_order);

CREATE TABLE category_sales_stats (
    id SERIAL NOT NULL, 
    name VARCHAR(120) NOT NULL, 
    value NUMERIC(8, 2) NOT NULL, 
    PRIMARY KEY (id), 
    UNIQUE (name)
);

CREATE TABLE channel_sales_stats (
    id SERIAL NOT NULL, 
    name VARCHAR(120) NOT NULL, 
    revenue NUMERIC(18, 2) NOT NULL, 
    PRIMARY KEY (id), 
    UNIQUE (name)
);

CREATE TABLE region_stats (
    id SERIAL NOT NULL, 
    name VARCHAR(120) NOT NULL, 
    revenue NUMERIC(18, 2) DEFAULT '0' NOT NULL, 
    orders INTEGER DEFAULT '0' NOT NULL, 
    share NUMERIC(8, 2) DEFAULT '0' NOT NULL, 
    PRIMARY KEY (id), 
    UNIQUE (name)
);

CREATE INDEX ix_region_stats_name ON region_stats (name);

CREATE TABLE activities (
    id SERIAL NOT NULL, 
    type VARCHAR(40) NOT NULL, 
    title VARCHAR(300) NOT NULL, 
    time VARCHAR(80) NOT NULL, 
    PRIMARY KEY (id)
);

CREATE TABLE customer_summary (
    id SERIAL NOT NULL, 
    total INTEGER DEFAULT '0' NOT NULL, 
    "new" INTEGER DEFAULT '0' NOT NULL, 
    returning_customers INTEGER DEFAULT '0' NOT NULL, 
    retention_rate NUMERIC(8, 2) DEFAULT '0' NOT NULL, 
    churn_rate NUMERIC(8, 2) DEFAULT '0' NOT NULL, 
    lifetime_value NUMERIC(18, 2) DEFAULT '0' NOT NULL, 
    PRIMARY KEY (id)
);

CREATE TABLE customer_segment_stats (
    id SERIAL NOT NULL, 
    name VARCHAR(80) NOT NULL, 
    customers INTEGER DEFAULT '0' NOT NULL, 
    average_spend NUMERIC(18, 2) DEFAULT '0' NOT NULL, 
    revenue_share NUMERIC(8, 2) DEFAULT '0' NOT NULL, 
    growth NUMERIC(8, 2) DEFAULT '0' NOT NULL, 
    PRIMARY KEY (id), 
    UNIQUE (name)
);

CREATE TABLE insights (
    id SERIAL NOT NULL, 
    type VARCHAR(40) NOT NULL, 
    title VARCHAR(255) NOT NULL, 
    description VARCHAR(1200) NOT NULL, 
    score INTEGER NOT NULL, 
    PRIMARY KEY (id)
);

CREATE INDEX ix_insights_type ON insights (type);

CREATE TABLE report_definitions (
    id VARCHAR(50) NOT NULL, 
    title VARCHAR(255) NOT NULL, 
    description VARCHAR(600) NOT NULL, 
    formats JSON NOT NULL, 
    PRIMARY KEY (id)
);

INSERT INTO alembic_version (version_num) VALUES ('0001_initial_postgres_schema') RETURNING alembic_version.version_num;

COMMIT;

