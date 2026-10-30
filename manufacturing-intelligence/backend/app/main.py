"""
Global Manufacturing Company Intelligence Platform — FastAPI Application.
Assembles REST API routers, handles database table bootstrap, and configures CORS.
"""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import create_all_tables, dispose_engine, AsyncSessionLocal
from app.workers.collector import CollectionWorker
from app.api.companies import router as companies_router
from app.api.jobs import router as jobs_router
from app.api.sources import router as sources_router
from app.api.quality import router as quality_router
from app.api.export import router as export_router

logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle handler."""
    logger.info("Initializing Global Manufacturing Intelligence Platform...")
    await create_all_tables()
    # Seed sources into database
    async with AsyncSessionLocal() as session:
        await CollectionWorker.initialize_sources(session)
    logger.info("Platform initialized and ready.")
    yield
    logger.info("Shutting down database connections...")
    await dispose_engine()


app = FastAPI(
    title="Global Manufacturing Company Intelligence Platform",
    description="Scalable system discovering, verifying, and enriching 50,000+ manufacturing companies.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers under /api/v1
app.include_router(companies_router, prefix="/api/v1")
app.include_router(jobs_router, prefix="/api/v1")
app.include_router(sources_router, prefix="/api/v1")
app.include_router(quality_router, prefix="/api/v1")
app.include_router(export_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "manufacturing-intelligence-platform",
        "target_companies": 50000,
        "environment": settings.ENVIRONMENT,
    }


import os
from fastapi.staticfiles import StaticFiles

dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist"))
if os.path.exists(dist_dir):
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="frontend")
else:
    @app.get("/", tags=["Health"])
    async def root():
        return {
            "name": "Global Manufacturing Company Intelligence Platform API",
            "version": "1.0.0",
            "docs_url": "/docs",
            "target_regions": [
                "United States",
                "United Kingdom",
                "Middle East (UAE, Saudi Arabia, Qatar, Oman, Bahrain, Kuwait)",
                "Singapore",
                "India",
            ],
        }

