CREATE TABLE IF NOT EXISTS cm.components (
  id BIGSERIAL PRIMARY KEY,
  framework TEXT NOT NULL,
  component TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  author_name TEXT NOT NULL DEFAULT 'Unknown',
  component_number TEXT NOT NULL DEFAULT 'N/A',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (framework, component)
);

CREATE TABLE IF NOT EXISTS cm.component_files (
  id BIGSERIAL PRIMARY KEY,
  component_id BIGINT NOT NULL REFERENCES cm.components(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (component_id, filename)
);

