import asyncio
import json
import random
import time

from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse

from backend.models import (
    MapInfo,
    Scanner,
    Tag,
    TagsUpdate,
)


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

FRONTEND_DIR = BASE_DIR.parent / "frontend"


app = FastAPI(
    title="alpha"
)


# ========================================
# Scanners
# ========================================

def load_scanners() -> list[Scanner]:

    path = DATA_DIR / "scanners.json"

    with open(path, "r", encoding="utf-8") as file:
        data = json.load(file)

    return [
        Scanner(**scanner)
        for scanner in data
    ]


scanners = load_scanners()


@app.get("/api/scanners")
async def get_scanners():

    return scanners


# ========================================
# Map
# ========================================

map_info = MapInfo(
    id="main-map",
    name="Основная карта",
    width=20,
    height=10,
    file="/api/map/file",
)


@app.get("/api/map")
async def get_map():

    return map_info


@app.get("/api/map/file")
async def get_map_file():

    return FileResponse(
        DATA_DIR / "map.svg",
        media_type="image/svg+xml",
    )


# ========================================
# Tags
# ========================================

tags = [
    Tag(
        id="tag-001",
        position={
            "x": 3.0,
            "y": 7.0,
        },
    ),
    Tag(
        id="tag-002",
        position={
            "x": 7.0,
            "y": 12.0,
        },
    ),
]


def update_test_tags():

    for tag in tags:

        tag.position.x += random.uniform(-0.2, 0.2)
        tag.position.y += random.uniform(-0.2, 0.2)

        tag.position.x = max(
            0,
            min(20, tag.position.x),
        )

        tag.position.y = max(
            0,
            min(10, tag.position.y),
        )


@app.websocket("/ws/tags")
async def tags_websocket(websocket: WebSocket):

    await websocket.accept()

    print("Tag client connected")

    try:

        while True:

            update_test_tags()

            message = TagsUpdate(
                type="tags_update",
                timestamp=time.time(),
                tags=tags,
            )

            await websocket.send_json(
                message.model_dump()
            )

            await asyncio.sleep(1)

    except WebSocketDisconnect:

        print("Tag client disconnected")


# ========================================
# Frontend
# ========================================

@app.get("/")
async def index():

    return FileResponse(
        FRONTEND_DIR / "index.html"
    )


@app.get("/style.css")
async def style_css():

    return FileResponse(
        FRONTEND_DIR / "css" / "style.css",
        media_type="text/css",
    )


@app.get("/js/{filename}")
async def javascript(filename: str):

    return FileResponse(
        FRONTEND_DIR / "js" / filename,
        media_type="application/javascript",
    )