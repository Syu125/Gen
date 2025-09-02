CREATE TABLE passengers (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    pickup_at_name VARCHAR(255),
    pickup_at_full_address TEXT,
    pickup_at_lat DOUBLE PRECISION,
    pickup_at_lng DOUBLE PRECISION,
    dropoff_at_name VARCHAR(255),
    dropoff_at_full_address TEXT,
    dropoff_at_lat DOUBLE PRECISION,
    dropoff_at_lng DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);