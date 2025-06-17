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
    watched_seasons JSONB DEFAULT CASE WHEN type = 'show' THEN '[]' ELSE NULL END,
    total_seasons INTEGER CHECK (type != 'show' OR total_seasons IS NOT NULL),
    show_status TEXT CHECK (type != 'show' OR show_status IS NOT NULL)
);

-- Default lists
INSERT INTO Lists (name) VALUES ('Watch')
ON CONFLICT DO NOTHING;