from fastapi import FastAPI, HTTPException, Response
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, HttpUrl
from typing import List
import requests
import asyncio
import os
from datetime import date

from datetime import date
from agent1_ import agent1_
from agent2_ import agent2_
from agent3_ import agent3_

app = FastAPI()


async def async_agent1_(data):
    return agent1_(data)

async def async_agent2_(data):
    return agent2_(data)

async def async_agent3_(data):
    return agent3_(data)

# Request schema
class ScanRequest(BaseModel):
    fullName: str
    age: int
    gender: str
    bloodGroup: str
    dateOfBirth: date
    medicalHistory: str
    currentMedications: str
    familyMedicalHistory: str
    documents: List[HttpUrl]
    summary: List[str]


# Async smart scan pipeline
async def smart_scan_pipeline(json_data: dict):
    output1 = await async_agent1_(json_data)
    # print(f"Output from agent1: {output1}")
    output2 = await async_agent2_(output1)
    print(f"Output from agent2: {output2}")
    output_path = await async_agent3_(output2)
    return os.path.abspath(output_path)

# Smart Scan Endpoint
@app.post("/smartscan")
async def smart_scan(request: ScanRequest):
    try:
        # Pass directly to the pipeline
        result_path = await smart_scan_pipeline(request.dict())
        return {"status": "success", "output_path": result_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scan failed: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to the Smart Scan API. Use /smartscan to initiate a scan."}