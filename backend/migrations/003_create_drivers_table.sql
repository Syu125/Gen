CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    leaving_from_name VARCHAR(255),
    leaving_from_full_address TEXT,
    leaving_from_lat DOUBLE PRECISION,
    leaving_from_lng DOUBLE PRECISION,
    coming_back_to_name VARCHAR(255),
    coming_back_to_full_address TEXT,
    coming_back_to_lat DOUBLE PRECISION,
    coming_back_to_lng DOUBLE PRECISION,
    capacity INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);