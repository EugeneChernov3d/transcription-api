# Transcription API

A Next.js-based API service providing audio transcription, text proofreading, and message composition powered by Groq's AI services.

## Deployed Instance

The API is deployed on Vercel: https://transcription-api-omega.vercel.app

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- Groq API Key

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

### Running Locally

Development mode (with hot reload):

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

Production mode:

```bash
npm run build
npm start
```

---

## API Endpoints

### 1. Transcribe Audio

Transcribes audio files to text using OpenAI's Whisper model via Groq.

**Endpoint:** `POST /api/transcribe`

**Request:**

- Content-Type: `multipart/form-data`
- Body: `file` - Audio file (.mp3, .wav, .m4a, etc.)

**Response:**

```json
{
  "text": "Transcribed text content"
}
```

**Examples:**

```bash
# Using curl
curl -X POST http://localhost:3000/api/transcribe \
  -F "file=@audio.mp3"
```

```javascript
// Using JavaScript/Fetch
const formData = new FormData();
formData.append("file", audioBlob, "audio.wav");

const response = await fetch("http://localhost:3000/api/transcribe", {
  method: "POST",
  body: formData,
});

const result = await response.json();
console.log(result.text);
```

---

### 2. Proofread Text

Corrects spelling, grammar, and punctuation in text.

**Endpoint:** `POST /api/proofread`

**Request:**

- Content-Type: `application/json`
- Body:

```json
{
  "text": "Your text with errors"
}
```

**Response:**

```json
{
  "originalText": "Original text with errors",
  "proofreadText": "Corrected text"
}
```

**Examples:**

```bash
curl -X POST http://localhost:3000/api/proofread \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a sentance with mistaks."}'
```

```javascript
const response = await fetch("http://localhost:3000/api/proofread", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "This is a sentance with mistaks." }),
});

const result = await response.json();
console.log(result.proofreadText);
```

---

### 3. Compose Message

Creates professional, clear, and concise messages based on descriptions.

**Endpoint:** `POST /api/compose`

**Request:**

- Content-Type: `application/json`
- Body:

```json
{
  "description": "Description of the message you want to compose"
}
```

**Response:**

```json
{
  "description": "Original description",
  "composedMessage": "Professional, clear, and concise message"
}
```

**Examples:**

```bash
curl -X POST http://localhost:3000/api/compose \
  -H "Content-Type: application/json" \
  -d '{"description": "I need to tell my team that the meeting is postponed and I will send a new calendar invite soon"}'
```

```javascript
const response = await fetch("http://localhost:3000/api/compose", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    description: "I need to tell my team that the meeting is postponed",
  }),
});

const result = await response.json();
console.log(result.composedMessage);
```

---

## Using the Deployed API

You can use the deployed Vercel instance by replacing `http://localhost:3000` with `https://transcription-api-omega.vercel.app`:

```bash
# Example with deployed endpoint
curl -X POST https://transcription-api-omega.vercel.app/api/proofread \
  -H "Content-Type: application/json" \
  -d '{"text": "Fix my grammar please"}'
```

---

## Error Handling

All endpoints return consistent error responses:

**400 Bad Request**

- Missing required parameters
- Invalid parameter types
- Invalid file uploads

**500 Internal Server Error**

- AI service failures
- Processing errors

**Error Response Format:**

```json
{
  "error": "Error message description"
}
```

---

## Technology Stack

- **Framework:** Next.js 15.5.6
- **Runtime:** Node.js
- **Language:** TypeScript
- **AI Services:** Groq SDK (Whisper transcription, Llama for text processing)
- **Styling:** Tailwind CSS

---

## License

MIT
