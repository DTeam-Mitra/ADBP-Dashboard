
-- PostgreSQL Database Schema for MITRA Dashboard
-- Run this script to set up your database tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schemes table
CREATE TABLE schemes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_achievement DECIMAL(5,2) NOT NULL DEFAULT 0,
    current_achievement DECIMAL(5,2) NOT NULL DEFAULT 0,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Regions table (hierarchical structure)
CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('country', 'state', 'district', 'block')),
    parent_id UUID REFERENCES regions(id),
    coordinates JSONB, -- Store lat/lng as JSON
    population BIGINT,
    literacy_rate DECIMAL(5,2),
    gdp_per_capita DECIMAL(10,2),
    healthcare_index DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indicators table (time-series data)
CREATE TABLE indicators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region_id UUID NOT NULL REFERENCES regions(id),
    scheme_id UUID NOT NULL REFERENCES schemes(id),
    indicator_type VARCHAR(100) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat sessions table
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    metadata JSONB
);

-- Chat messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id),
    message TEXT NOT NULL,
    is_user_message BOOLEAN NOT NULL DEFAULT TRUE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Webhook logs table
CREATE TABLE webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_url VARCHAR(500),
    payload JSONB,
    response JSONB,
    status_code INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_indicators_region_scheme ON indicators(region_id, scheme_id);
CREATE INDEX idx_indicators_timestamp ON indicators(timestamp);
CREATE INDEX idx_regions_parent ON regions(parent_id);
CREATE INDEX idx_regions_type ON regions(type);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX idx_chat_sessions_session_id ON chat_sessions(session_id);

-- Insert sample data
INSERT INTO regions (id, name, type, coordinates, population, literacy_rate) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'India', 'country', '{"lat": 20.5937, "lng": 78.9629}', 1380000000, 77.7),
    ('550e8400-e29b-41d4-a716-446655440001', 'Maharashtra', 'state', '{"lat": 19.7515, "lng": 75.7139}', 112000000, 82.3),
    ('550e8400-e29b-41d4-a716-446655440002', 'Uttar Pradesh', 'state', '{"lat": 26.8467, "lng": 80.9462}', 199000000, 67.7),
    ('550e8400-e29b-41d4-a716-446655440003', 'Karnataka', 'state', '{"lat": 15.3173, "lng": 75.7139}', 61000000, 75.4),
    ('550e8400-e29b-41d4-a716-446655440004', 'Tamil Nadu', 'state', '{"lat": 11.1271, "lng": 78.6569}', 72000000, 80.1);

-- Set parent_id for states (all belong to India)
UPDATE regions SET parent_id = '550e8400-e29b-41d4-a716-446655440000' 
WHERE type = 'state';

INSERT INTO schemes (id, name, description, target_achievement, current_achievement) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', 'Pradhan Mantri Kisan Samman Nidhi', 'Financial support to farmers', 98.0, 98.0),
    ('660e8400-e29b-41d4-a716-446655440001', 'Pradhan Mantri Jan Arogya Yojana', 'Healthcare coverage scheme', 98.0, 98.0),
    ('660e8400-e29b-41d4-a716-446655440002', 'Mahila Samriddhi Yojana', 'Women empowerment scheme', 98.0, 98.0),
    ('660e8400-e29b-41d4-a716-446655440003', 'Mukhyamantri Yuva Karya Prashikshan Yojana', 'Youth skill development', 98.0, 98.0);

-- Insert sample indicator data
INSERT INTO indicators (region_id, scheme_id, indicator_type, value, unit) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', 'enrollment_rate', 98.0, 'percentage'),
    ('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'coverage_rate', 98.0, 'percentage'),
    ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440000', 'enrollment_rate', 98.0, 'percentage'),
    ('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'coverage_rate', 98.0, 'percentage');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at field
CREATE TRIGGER update_schemes_updated_at BEFORE UPDATE ON schemes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_regions_updated_at BEFORE UPDATE ON regions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
