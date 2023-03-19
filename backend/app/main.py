from fastapi import FastAPI, Depends, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import Request
import typing as t
import uvicorn
import json

from topic_modeling import TopicModeling

FILE_PATH = 'processed_df.csv'

app = FastAPI(
    title="Topic Modeling backend API", docs_url="/docs"
)


origins = [
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

topic_modeling = TopicModeling(FILE_PATH)


class TopicTitleDistribution(BaseModel):
    topic: int
    count: int

class TopicDocuments(BaseModel):
    id: int
    title: str
    company: str
    announcement: str
    description: str
    seniority_level: str
    years_of_experience: int
    topic: int
    title_tokens: list[str]


class TopicWordCloud(BaseModel):
    word: str
    prob: float




@app.get("/")
async def root(request: Request):
    return {"message": "Server is up and running!"}



@app.get("/topics")
async def topics(request: Request) -> t.List[int]:
    return topic_modeling.get_topics()


@app.get("/topic-title-distribution")
async def topic_title_distribution(request: Request) -> t.List[TopicTitleDistribution]:
    data = topic_modeling.get_topic_title_distibution()
    return data


@app.get("/topic-wordcloud/{topic_id}")
async def topic_wordcloud(request: Request, topic_id:int) -> t.List[TopicWordCloud]:
    return topic_modeling.get_topic_top_terms(topic_id)


@app.get("/topic-documents/{topic_id}")
async def topic_documents(request: Request, topic_id: int) -> t.List[TopicDocuments]:
    topic_documsnts = topic_modeling.get_topic_documents(topic_id)
    return topic_documsnts

@app.get("/topic-documents")
async def all_topics_documents(request: Request) -> t.List[TopicDocuments]:
    topic_documsnts = topic_modeling.get_all_topics_documents()
    return topic_documsnts



@app.get("/word-topics/{word}")
async def term_topics(request: Request, word: str):
    return topic_modeling.get_term_topics(word)



if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", reload=True, port=8000)