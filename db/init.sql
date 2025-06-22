-- User table
CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    region TEXT NOT NULL DEFAULT 'GB',
    language TEXT NOT NULL DEFAULT 'en-GB',
    original_title BOOLEAN NOT NULL DEFAULT FALSE,
    include_adult BOOLEAN NOT NULL DEFAULT FALSE,
    timezone TEXT NOT NULL DEFAULT 'Europe/London',
    subscription TEXT DEFAULT NULL
);

-- Lists table
CREATE TABLE IF NOT EXISTS Lists (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Media table
CREATE TABLE IF NOT EXISTS Media (
    id SERIAL PRIMARY KEY,
    tmdb_id INTEGER NOT NULL,
    type TEXT CHECK (type IN ('movie', 'show')),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    list_id INTEGER REFERENCES Lists(id) ON DELETE CASCADE
);

-- Watched table
CREATE TABLE IF NOT EXISTS Watched (
    id SERIAL PRIMARY KEY,
    tmdb_id INTEGER NOT NULL,
    type TEXT CHECK (type IN ('movie', 'show')),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL,
    watched_seasons DECIMAL[] DEFAULT ARRAY[]::DECIMAL[],
    total_seasons INTEGER,
    show_status TEXT
);

-- Default lists
INSERT INTO Lists (name) VALUES ('Watch')
ON CONFLICT DO NOTHING;

-- Default user
INSERT INTO Users
VALUES (DEFAULT)
ON CONFLICT DO NOTHING;