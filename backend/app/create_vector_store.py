from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings

import chromadb
from chromadb.config import Settings

def load_documents_from_directory(directory: str):
    data_path = directory
    #print("Location:" + data_path)
    loader = DirectoryLoader(data_path,glob="**/*.md")
    documents= loader.load()
    return documents

def document_splitter(documents):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, separators=["--"])
    split_docs = text_splitter.split_documents(documents)
    return split_docs



def create_vector_store():
    vectorstore = Chroma(
        collection_name="markdown_rag",
        embedding_function=OpenAIEmbeddings(),
        client_settings=Settings(anonymized_telemetry=False)
    )
    documents = load_documents_from_directory("./")
    #print(documents)
    split_docs = document_splitter(documents)
    vectorstore.add_documents(split_docs)

    return vectorstore