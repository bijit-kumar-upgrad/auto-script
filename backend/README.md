# FastAPI Chat API

This is a FastAPI backend service that send requests to the GitHub AI inference endpoint. It allows users to send messages and receive AI-generated responses.

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI app entrypoint with /api/chat POST endpoint
│   ├── services.py       # Service layer to call GitHub AI inference endpoint using OpenAI SDK
│   └── config.py         # Load environment variables for GITHUB_TOKEN and API endpoint
├── requirements.txt      # List of Python dependencies: fastapi, uvicorn, openai
├── .env.example          # Example env file showing how to set GITHUB_TOKEN
└── README.md             # Project documentation
```

## Requirements

- Python 3.7 or higher
- Install the required dependencies listed in `requirements.txt` using pip.

## Installation

1. Clone the repository:
   ```
   git clone <YOUR_REPOSITORY_URL>
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on the `.env.example` file and set your `GITHUB_TOKEN`:
   ```
   cp .env.example .env
   ```

## Running the Application

To run the FastAPI application locally, use the following command:

```
uvicorn app.main:app --reload
```

- The application will be available at `http://127.0.0.1:8000`.
- You can access the interactive API documentation at `http://127.0.0.1:8000/docs`.

## Usage

To interact with the chat API, send a POST request to `/api/chat` with the following JSON structure:

### Request Example

```json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"}
  ],
  "temperature": 1.0,
  "top_p": 1.0
}
```

### Response Example

```json
{
  "response": "Paris"
}
```

## Error Handling

The application includes error handling for unauthorized access and request failures, ensuring that appropriate error messages are returned in case of issues.

## License

This project is licensed under the MIT License.