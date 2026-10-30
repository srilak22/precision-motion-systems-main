"""
Root Launcher for the Global Manufacturing Company Intelligence Platform.
Runs the FastAPI application hosting the REST API, Background Workers,
and the compiled React + Vite + TypeScript Dashboard.
"""
import os
import sys
import uvicorn

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

if __name__ == "__main__":
    print("=" * 70)
    print("GLOBAL MANUFACTURING COMPANY INTELLIGENCE PLATFORM")
    print("Target: 50,000 Unique Validated Manufacturing Companies")
    print("Serving Dashboard & API on http://localhost:8000")
    print("API Documentation on http://localhost:8000/docs")
    print("=" * 70)
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)

