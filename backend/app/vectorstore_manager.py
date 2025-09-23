from langchain_chroma import Chroma
from langchain_community.document_loaders import DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from chromadb.config import Settings

DATA_DIR = "app/data"            # folder with your .md templates
PERSIST_DIR = "./chroma_store"   # folder where vectorstore is saved

_vectorstore = None  # internal cache

"""Load all markdown files from directory."""
def load_documents_from_directory(directory: str):
    loader = DirectoryLoader(directory,glob="**/*.md")
    documents = loader.load()
    return documents

"""Split documents into smaller chunks for better retrieval."""
def document_splitter(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        separators=["--"]
    )
    split_docs = text_splitter.split_documents(documents)
    return split_docs

"""Initialize or load a persistent Chroma vectorstore."""
def init_vectorstore():
    global _vectorstore

    if _vectorstore is None:
        print("Initializing vectorstore...")
        vectorstore = Chroma(
            collection_name="markdown_rag",
            embedding_function=OpenAIEmbeddings(),
            persist_directory=PERSIST_DIR,
            client_settings=Settings(anonymized_telemetry=False)
        )

        # Only add documents if the store is empty
        if not vectorstore._collection.count():
            print("Building new vectorstore from markdown files...")
            documents = load_documents_from_directory(DATA_DIR)
            #print(f"Docs: {documents}")
            split_docs = document_splitter(documents)
            vectorstore.add_documents(split_docs)
            print(f"Vectorstore built with {len(split_docs)} chunks.")
        else:
            print("Loaded existing vectorstore from disk.")

        _vectorstore = vectorstore

    return _vectorstore