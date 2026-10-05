from pydantic import BaseModel


class Position(BaseModel):
    x: float
    y: float


class Scanner(BaseModel):
    id: str
    name: str
    position: Position
    range: float


class Tag(BaseModel):
    id: str
    position: Position


class TagsUpdate(BaseModel):
    type: str
    timestamp: float
    tags: list[Tag]


class MapInfo(BaseModel):
    id: str
    name: str
    width: float
    height: float
    file: str