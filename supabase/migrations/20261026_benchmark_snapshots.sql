-- Additive; apply once before enabling benchmark imports. Existing tables unchanged.
CREATE TABLE IF NOT EXISTS "BenchmarkSnapshot" (
  "id" TEXT PRIMARY KEY,
  "source" TEXT NOT NULL,
  "sourceRevision" TEXT NOT NULL,
  "sourceUpdatedAt" TIMESTAMP(3),
  "retrievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "payload" JSONB NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "BenchmarkSnapshot_source_sourceRevision_key" ON "BenchmarkSnapshot"("source", "sourceRevision");
CREATE INDEX IF NOT EXISTS "BenchmarkSnapshot_source_retrievedAt_idx" ON "BenchmarkSnapshot"("source", "retrievedAt" DESC);
-- Access is server-only through Prisma. No anonymous REST policies.
ALTER TABLE "BenchmarkSnapshot" ENABLE ROW LEVEL SECURITY;
