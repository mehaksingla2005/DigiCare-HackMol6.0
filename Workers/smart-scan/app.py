from agent1_ import agent1_
from agent2_ import agent2_
from agent3_ import agent3_

from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any

import os
import asyncio

app = FastAPI()


# Pydantic model for request body
@app.get("/")
async def root(data: Dict[Any, Any]):
    chroma_session_id = agent1_(data)
    insights = agent2_(chroma_session_id)   

    return agent3_(insights)