-- Table: monitored_sites
CREATE TABLE IF NOT EXISTS monitored_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  display_name TEXT,
  check_interval_minutes INT DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, url)
);

ALTER TABLE monitored_sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own sites" ON monitored_sites
  FOR ALL USING (auth.uid() = user_id);

-- Table: uptime_checks
CREATE TABLE IF NOT EXISTS uptime_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES monitored_sites(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  checked_at TIMESTAMPTZ DEFAULT now(),
  is_up BOOLEAN NOT NULL,
  status_code INT,
  response_ms INT,
  region TEXT,
  ssl_valid BOOLEAN,
  ssl_days_remaining INT,
  error_message TEXT
);

ALTER TABLE uptime_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own checks" ON uptime_checks
  FOR SELECT USING (
    site_id IS NULL OR
    EXISTS (
      SELECT 1 FROM monitored_sites ms
      WHERE ms.id = uptime_checks.site_id AND ms.user_id = auth.uid()
    )
  );
CREATE POLICY "Insert checks" ON uptime_checks
  FOR INSERT WITH CHECK (true);

CREATE INDEX idx_uptime_checks_site_checked ON uptime_checks(site_id, checked_at DESC);
CREATE INDEX idx_uptime_checks_url_checked ON uptime_checks(url, checked_at DESC);
