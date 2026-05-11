# Portfolio Contact API

FastAPI backend for the Kemigisa Suzan portfolio contact form.

## What it does

- Receives contact form submissions (name, email, subject, message)
- Sends **you** a nicely formatted notification email
- Sends the **sender** an automatic reply confirming receipt
- Validates all inputs before attempting to send

## Quick Start

```bash
# 1. Clone / copy this folder into your project
cd portfolio-backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env
# → Edit .env and fill in your Gmail App Password

# 5. Run the server
uvicorn main:app --reload --port 8000
```

API is now live at **http://localhost:8000**  
Interactive docs at **http://localhost:8000/docs**

---

## Getting a Gmail App Password

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (required)
3. Search for **App Passwords**
4. Create one for "Mail" → copy the 16-character password
5. Paste it as `SMTP_PASSWORD` in your `.env`

> ⚠️ Never use your real Gmail password. Always use an App Password.

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `SMTP_USER` | Your Gmail address | `kemigisa32@gmail.com` |
| `SMTP_PASSWORD` | Gmail App Password (16 chars) | `abcd efgh ijkl mnop` |
| `TO_EMAIL` | Where to receive messages | `kemigisa32@gmail.com` |
| `ALLOWED_ORIGINS` | Frontend URL(s), comma-separated | `https://yoursite.vercel.app` |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | API status |
| `GET` | `/health` | Health check |
| `POST` | `/contact` | Submit contact form |

### POST /contact

**Request body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "subject": "Job opportunity",
  "message": "Hello Suzan..."
}
```

**Success response:**
```json
{
  "success": true,
  "message": "Message sent! I'll get back to you within 24–48 hours."
}
```

---

## Running Tests

```bash
pytest test_contact.py -v
```

All tests are fully mocked — no real emails sent, no API keys needed.

---

## Deploying to Render (free tier)

1. Push this folder to a GitHub repo
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo
4. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables in the Render dashboard
6. Update `ALLOWED_ORIGINS` to your portfolio's Vercel URL

---

## Connecting to your React/HTML portfolio

Replace the Send button's `onclick` with a real fetch call:

```javascript
async function sendContactForm(e) {
  e.preventDefault();
  const res = await fetch("https://your-backend.onrender.com/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, subject, message })
  });
  const data = await res.json();
  if (data.success) alert("Message sent!");
  else alert("Error: " + data.detail);
}
```