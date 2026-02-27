CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    subtotal NUMERIC NOT NULL,
    composite_tax_rate NUMERIC,
    tax_amount NUMERIC,
    total_amount NUMERIC,
    breakdown JSONB,
    jurisdictions JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
    );