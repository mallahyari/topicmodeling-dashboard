import pandas as pd
import numpy as np
import nltk
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from gensim.corpora import Dictionary
from gensim.models import LdaModel
from gensim.models.coherencemodel import CoherenceModel
import logging
import os


logging.basicConfig(format='%(asctime)s %(message)s', level=logging.INFO)
nltk.download('stopwords')
nltk.download('wordnet')

stop_words = stopwords.words('english')
lemmatizer = WordNetLemmatizer()


class TopicModeling:

    def __init__(self, filepath: str):
        try:
            self.df = pd.read_csv(filepath)
            logging.info(f"{filepath} file successfully loaded.")
        except Exception as e:
            logging.error(f"Error: {filepath} could not be loaded")
           
        # Preprocess the job titles
        self.df['title_tokens'] = self.df['title'].apply(self.preprocess)

        # Create a dictionary from the job titles
        self.dictionary = Dictionary(self.df['title_tokens'])

        # Get the list of topics
        self.topics = sorted(self.df.topic.unique().tolist())

        # Create a corpus from the dictionary and job titles
        self.corpus = [self.dictionary.doc2bow(title_tokens) for title_tokens in self.df['title_tokens']]

        # Load topic model from file
        self.lda_model = LdaModel.load('model/tm.model')

    def preprocess(self, text: str):
        tokens = nltk.word_tokenize(text.lower())
        tokens = [token for token in tokens if token not in stop_words and token.isalpha()]
        tokens = [lemmatizer.lemmatize(token) for token in tokens]
        return tokens
    

    def get_topics(self):
        return self.topics

    def get_topic_title_distibution(self):
        # Group job titles by topic and count the number of titles in each group
        topic_counts = self.df.groupby('topic')['title'].count()
        counts =  topic_counts.values.tolist()
        data = []
        for t in topic_counts.index:
            data.append({"topic": t, "count": counts[t]})
        return data
    

    def get_topic_documents(self, topic_id:int):
        data = self.df[self.df['topic'] == topic_id].to_dict(orient='record')
        results = []
        for row in data:
            results.append({"id": row["id"], "title": row["title"],
                            "company": row["company"], "announcement": row["announcement"],
                            "description": row["description"], "seniority_level": row["seniority_level"],
                            "years_of_experience": row["years_of_experience"], "topic": row["topic"],
                            "title_tokens": row["title_tokens"]})
        return results
    
    def get_all_topics_documents(self):
        data = self.df.to_dict(orient='record')
        results = []
        for row in data:
            results.append({"id": row["id"], "title": row["title"],
                            "company": row["company"], "announcement": row["announcement"],
                            "description": row["description"], "seniority_level": row["seniority_level"],
                            "years_of_experience": row["years_of_experience"], "topic": row["topic"],
                            "title_tokens": row["title_tokens"]})
        return results
    

    def get_term_topics(self, word: str):
        word_id = self.dictionary.token2id[word]
        results = self.lda_model.get_term_topics(word_id=word_id, minimum_probability=0)
        wtopics = []
        for topic,prob in results:
            wtopics.append({"topic": topic, "dist":round(float(prob), 5)})
        return wtopics


    def get_topic_top_terms(self, topic_id: int):
        results = self.lda_model.get_topic_terms(topicid=topic_id, topn=100)
        top_words = []
        for word_id,prob in results:
            top_words.append({"word": self.dictionary[word_id],
                              "prob": round(float(prob), 5)})
        return top_words