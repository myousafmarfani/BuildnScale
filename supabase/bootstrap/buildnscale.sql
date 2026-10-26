-- Initialize a NEW, EMPTY BuildnScale Supabase database only.
-- Generated from prisma/schema.prisma using the repository's Prisma 6 CLI.
-- No credentials are included. Existing application tables cause an abort.
BEGIN;
SET LOCAL search_path = public, pg_catalog;
SET LOCAL lock_timeout = '10s';
SET LOCAL statement_timeout = '60s';
DO $guard$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name IN ('User', 'UserData', 'Account', 'Session', 'VerificationToken', 'monitored_sites', 'uptime_checks', 'BenchmarkSnapshot')
  ) THEN
    RAISE EXCEPTION 'BuildnScale tables already exist. Initialization stopped; use reviewed incremental migrations instead.';
  END IF;
END;
$guard$;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserData" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "monitored_sites" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "display_name" TEXT,
    "check_interval_minutes" INTEGER NOT NULL DEFAULT 5,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "monitored_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uptime_checks" (
    "id" UUID NOT NULL,
    "site_id" UUID,
    "url" TEXT NOT NULL,
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_up" BOOLEAN NOT NULL,
    "status_code" INTEGER,
    "response_ms" INTEGER,
    "region" TEXT,
    "ssl_valid" BOOLEAN,
    "ssl_days_remaining" INTEGER,
    "error_message" TEXT,

    CONSTRAINT "uptime_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BenchmarkSnapshot" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceRevision" TEXT NOT NULL,
    "sourceUpdatedAt" TIMESTAMP(3),
    "retrievedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payload" JSONB NOT NULL,

    CONSTRAINT "BenchmarkSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserData_userId_key_key" ON "UserData"("userId", "key");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "monitored_sites_userId_url_key" ON "monitored_sites"("userId", "url");

-- CreateIndex
CREATE INDEX "uptime_checks_site_id_checked_at_idx" ON "uptime_checks"("site_id", "checked_at" DESC);

-- CreateIndex
CREATE INDEX "uptime_checks_url_checked_at_idx" ON "uptime_checks"("url", "checked_at" DESC);

-- CreateIndex
CREATE INDEX "BenchmarkSnapshot_source_retrievedAt_idx" ON "BenchmarkSnapshot"("source", "retrievedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "BenchmarkSnapshot_source_sourceRevision_key" ON "BenchmarkSnapshot"("source", "sourceRevision");

-- AddForeignKey
ALTER TABLE "UserData" ADD CONSTRAINT "UserData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monitored_sites" ADD CONSTRAINT "monitored_sites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uptime_checks" ADD CONSTRAINT "uptime_checks_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "monitored_sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Prisma connects server-side using the database role. No browser API access.
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."UserData" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."monitored_sites" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."uptime_checks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."BenchmarkSnapshot" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public."User", public."UserData", public."Account", public."Session", public."VerificationToken", public."monitored_sites", public."uptime_checks", public."BenchmarkSnapshot" FROM anon, authenticated;

COMMIT;

-- Successful setup returns the eight application table names.
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('User', 'UserData', 'Account', 'Session', 'VerificationToken', 'monitored_sites', 'uptime_checks', 'BenchmarkSnapshot')
ORDER BY table_name;
