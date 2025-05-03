-- Lists
CREATE TABLE IF NOT EXISTS Lists (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

-- Media
CREATE TABLE IF NOT EXISTS Media (
    id SERIAL PRIMARY KEY,
    tmdb_id INTEGER NOT NULL,
    type TEXT CHECK (type IN ('movie', 'show'))
);

-- ListMedia
CREATE TABLE IF NOT EXISTS ListMedia (
    list_id INTEGER REFERENCES Lists(id) ON DELETE CASCADE,
    media_id INTEGER REFERENCES Media(id) ON DELETE CASCADE,
    PRIMARY KEY (list_id, media_id)
);