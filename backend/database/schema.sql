CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE tax_jurisdictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    level VARCHAR(50) NOT NULL,
    boundaries GEOMETRY(MultiPolygon, 4326) NOT NULL
);

CREATE TABLE tax_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jurisdiction_id UUID REFERENCES tax_jurisdictions(id) ON DELETE CASCADE,
    rate NUMERIC(7, 5) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_tax_jurisdictions_boundaries ON tax_jurisdictions USING GIST (boundaries);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subtotal NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 4) NOT NULL,
    composite_tax_rate NUMERIC(7, 5) NOT NULL,
    latitude NUMERIC(10, 8) NOT NULL,
    longitude NUMERIC(11, 8) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_tax_breakdown (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    jurisdiction_name VARCHAR(255) NOT NULL,
    rate NUMERIC(7, 5) NOT NULL,
    level VARCHAR(50) NOT NULL
);