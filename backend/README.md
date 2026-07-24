# KSP Crime Intelligence Copilot - Backend

This directory contains all backend services, serverless functions, database schemas, and API documentation for the Karnataka State Police (KSP) Crime Intelligence Copilot built on Zoho Catalyst.

## Structure

```
backend/
├── functions/               # Catalyst serverless function modules
│   ├── admin/              # Database management & admin tasks
│   ├── analytics/          # Predictive insights & demographic analytics
│   ├── assistant/          # Copilot AI agent router & skill execution engine
│   ├── auth/               # Role resolution & session validation
│   ├── cases/              # Crime case management & search API handlers
│   ├── graph/              # Relationship graph & offender profile builder
│   ├── map/                # Hotspot map clustering & GIS data query
│   ├── reports/            # Automated report generation service
│   ├── shared/             # Common datastore, SDK, & utility functions
│   └── voice/              # Text-to-speech rendering service
├── data/                    # Database schemas and seed data generator
│   ├── mock/               # Mock data JSON & seed script
│   └── schema/             # Master & transactional table schemas
├── catalyst.json            # Zoho Catalyst backend configuration
├── app-config.json         # Catalyst application configuration
├── .catalystrc              # Catalyst runtime CLI configuration
├── api_integration_guide.md # Comprehensive backend API documentation
├── scratch/                # Diagnostic scripts and integration tests
└── package.json            # Backend package configuration
```

## Setup & Deployment

1. Install dependencies inside specific function folders in `functions/`.
2. To seed mock database records:
   ```bash
   npm run seed
   ```
3. To start local Catalyst development server:
   ```bash
   npm run serve
   ```
