# API Access for Browser Extensions

## Endpoint
```
POST http://localhost:3000/api/transcribe
```

## Usage
```javascript
const formData = new FormData();
formData.append('file', audioBlob, 'audio.wav');

const response = await fetch('http://localhost:3000/api/transcribe', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.text); // Transcribed text
```

## Requirements
- Send audio file as FormData with 'file' key
- No authentication needed (development only)
- Returns JSON with 'text' field containing transcription