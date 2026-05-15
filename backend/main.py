from fastapi import FastAPI, HTTPException, UploadFile, File, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import logging
import shutil
import secrets
from pathlib import Path
from typing import Optional

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Upload storage ─────────────────────────────────────────────────────────────
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "/tmp/portfolio_uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

PHOTO_PATH = UPLOAD_DIR / "profile_photo"   # extension stored separately
CV_PATH    = UPLOAD_DIR / "cv.pdf"
META_PATH  = UPLOAD_DIR / "meta.json"       # stores photo extension & cv filename

ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")  # set a strong secret in .env

# ── Seed from env vars on cold start (Vercel-safe persistence) ────────────────
# If PHOTO_BASE64 / CV_BASE64 are set in Vercel env vars, write them to disk
# so the GET endpoints can serve them even after a cold start.
import base64, json as _json

def _seed_from_env():
    photo_b64 = os.getenv("PHOTO_BASE64", "")
    photo_ext = os.getenv("PHOTO_EXT", ".jpg")
    cv_b64    = os.getenv("CV_BASE64", "")
    cv_name   = os.getenv("CV_NAME", "Kemigisa_Suzan_CV.pdf")

    meta = {}
    if META_PATH.exists():
        try: meta = _json.loads(META_PATH.read_text())
        except Exception: pass

    if photo_b64:
        dest = UPLOAD_DIR / f"profile_photo{photo_ext}"
        if not dest.exists():   # don't overwrite a freshly uploaded one
            dest.write_bytes(base64.b64decode(photo_b64))
            meta["photo_ext"] = photo_ext

    if cv_b64:
        if not CV_PATH.exists():
            CV_PATH.write_bytes(base64.b64decode(cv_b64))
            meta["cv_name"] = cv_name

    if meta:
        META_PATH.write_text(_json.dumps(meta))

_seed_from_env()

def require_admin(authorization: Optional[str]):
    """Simple bearer-token auth for admin-only upload endpoints."""
    token = (authorization or "").replace("Bearer ", "").strip()
    if not ADMIN_TOKEN or not secrets.compare_digest(token, ADMIN_TOKEN):
        raise HTTPException(status_code=401, detail="Unauthorized")

app = FastAPI(title="Kemigisa Suzan — Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Models ────────────────────────────────────────────────────────────────────

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ContactResponse(BaseModel):
    success: bool
    message: str

# ── Email helper ──────────────────────────────────────────────────────────────

def send_email(form: ContactForm) -> None:
    smtp_host     = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port     = int(os.getenv("SMTP_PORT", "587"))
    smtp_user     = os.getenv("SMTP_USER")       # your Gmail address
    smtp_password = os.getenv("SMTP_PASSWORD")   # Gmail App Password
    to_email      = os.getenv("TO_EMAIL", smtp_user)  # where to receive messages

    if not smtp_user or not smtp_password:
        raise RuntimeError("SMTP credentials not configured. Check your .env file.")

    # ── Email to YOU (notification) ───────────────────────────────────────────
    notify_msg = MIMEMultipart("alternative")
    notify_msg["Subject"] = f"[Portfolio] {form.subject}"
    notify_msg["From"]    = smtp_user
    notify_msg["To"]      = to_email

    notify_html = f"""
    <html><body style="font-family:sans-serif;max-width:560px;margin:auto;padding:24px;background:#f9f9f9">
      <div style="background:#06060A;border-radius:12px;padding:32px;color:#EEE8FF">
        <h2 style="color:#F0C060;margin-bottom:4px">New Portfolio Message</h2>
        <p style="color:#7A7490;font-size:13px;margin-top:0">via kemigisasuzan.dev</p>
        <hr style="border-color:#1A1A2A;margin:20px 0"/>
        <table style="width:100%;font-size:14px;color:#A89FC0">
          <tr><td style="padding:6px 0;color:#7A7490;width:80px">From</td><td style="color:#EEE8FF">{form.name}</td></tr>
          <tr><td style="padding:6px 0;color:#7A7490">Email</td><td><a href="mailto:{form.email}" style="color:#9D7FEA">{form.email}</a></td></tr>
          <tr><td style="padding:6px 0;color:#7A7490">Subject</td><td style="color:#EEE8FF">{form.subject}</td></tr>
        </table>
        <hr style="border-color:#1A1A2A;margin:20px 0"/>
        <h4 style="color:#F0C060;margin-bottom:10px">Message</h4>
        <p style="color:#A89FC0;line-height:1.8;white-space:pre-wrap">{form.message}</p>
      </div>
    </body></html>
    """
    notify_msg.attach(MIMEText(notify_html, "html"))

    # ── Auto-reply to SENDER ──────────────────────────────────────────────────
    reply_msg = MIMEMultipart("alternative")
    reply_msg["Subject"] = f"Re: {form.subject} — Got your message!"
    reply_msg["From"]    = f"Kemigisa Suzan <{smtp_user}>"
    reply_msg["To"]      = form.email

    reply_html = f"""
    <html><body style="font-family:sans-serif;max-width:560px;margin:auto;padding:24px;background:#f9f9f9">
      <div style="background:#06060A;border-radius:12px;padding:32px;color:#EEE8FF">
        <h2 style="color:#F0C060;margin-bottom:4px">Hey {form.name}! 👋</h2>
        <p style="color:#A89FC0;line-height:1.8">
          Thanks for reaching out — I've received your message and will get back to you as soon as possible, typically within 12–24 hours.
        </p>
        <div style="background:#0D0D14;border:1px solid #1A1A2A;border-radius:8px;padding:16px;margin:20px 0">
          <p style="color:#7A7490;font-size:12px;margin:0 0 6px">Your message:</p>
          <p style="color:#A89FC0;font-size:13px;line-height:1.7;white-space:pre-wrap;margin:0">{form.message}</p>
        </div>
        <p style="color:#A89FC0;line-height:1.8">
          While you wait, feel free to check out my work on 
          <a href="https://github.com/Susankemigisa" style="color:#9D7FEA">GitHub</a> or connect on 
          <a href="https://www.linkedin.com/in/suzan-kemigisa/" style="color:#9D7FEA">LinkedIn</a>.
        </p>
        <hr style="border-color:#1A1A2A;margin:24px 0"/>
        <p style="color:#7A7490;font-size:12px;margin:0">
          Kemigisa Suzan · Software & AI Engineer · Kampala, Uganda
        </p>
      </div>
    </body></html>
    """
    reply_msg.attach(MIMEText(reply_html, "html"))

    # ── Send both ─────────────────────────────────────────────────────────────
    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.ehlo()
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(notify_msg)
        server.send_message(reply_msg)
        logger.info(f"Emails sent — from: {form.email}, subject: {form.subject}")

# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "ok", "api": "Kemigisa Suzan Portfolio API"}

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/contact", response_model=ContactResponse)
async def contact(form: ContactForm):
    # Basic validation
    if len(form.name.strip()) < 2:
        raise HTTPException(status_code=422, detail="Name must be at least 2 characters.")
    if len(form.message.strip()) < 10:
        raise HTTPException(status_code=422, detail="Message must be at least 10 characters.")
    if len(form.subject.strip()) < 3:
        raise HTTPException(status_code=422, detail="Subject must be at least 3 characters.")

    try:
        send_email(form)
        return ContactResponse(
            success=True,
            message="Message sent! I'll get back to you within 24–48 hours."
        )
    except RuntimeError as e:
        logger.error(f"Config error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except smtplib.SMTPAuthenticationError:
        logger.error("SMTP authentication failed")
        raise HTTPException(status_code=500, detail="Email authentication failed. Check SMTP credentials.")
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send message. Please try again later.")

# ── Photo endpoints ────────────────────────────────────────────────────────────

@app.get("/photo/exists")
def photo_exists():
    """Returns whether a profile photo has been uploaded."""
    import json
    try:
        meta = json.loads(META_PATH.read_text()) if META_PATH.exists() else {}
    except Exception:
        meta = {}
    ext = meta.get("photo_ext", "")
    path = UPLOAD_DIR / f"profile_photo{ext}"
    return {"exists": path.exists()}

@app.get("/photo")
def get_photo():
    """Return the profile photo. 404 if not uploaded yet."""
    import json
    try:
        meta = json.loads(META_PATH.read_text()) if META_PATH.exists() else {}
    except Exception:
        meta = {}
    ext = meta.get("photo_ext", "")
    path = UPLOAD_DIR / f"profile_photo{ext}"
    if not path.exists():
        raise HTTPException(status_code=404, detail="No photo uploaded yet")
    return FileResponse(path, media_type=f"image/{ext.lstrip('.') or 'jpeg'}", headers={
        "Cache-Control": "public, max-age=3600"
    })

@app.post("/photo")
async def upload_photo(
    file: UploadFile = File(...),
    authorization: Optional[str] = Header(default=None),
):
    """Admin only — upload a new profile photo."""
    require_admin(authorization)
    allowed = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}
    ext = Path(file.filename or "").suffix.lower()
    if ext not in allowed:
        raise HTTPException(status_code=400, detail="Only jpg, png, webp images are accepted")
    dest = UPLOAD_DIR / f"profile_photo{ext}"
    # Remove old photo files with any extension
    for old in UPLOAD_DIR.glob("profile_photo.*"):
        old.unlink(missing_ok=True)
    with dest.open("wb") as f:
        shutil.copyfileobj(file.file, f)
    # Update meta
    import json
    meta = json.loads(META_PATH.read_text()) if META_PATH.exists() else {}
    meta["photo_ext"] = ext
    META_PATH.write_text(json.dumps(meta))
    # Log base64 so you can copy it to PHOTO_BASE64 env var in Vercel
    b64 = base64.b64encode(dest.read_bytes()).decode()
    logger.info(f"PHOTO_BASE64 (copy to Vercel env vars):\n{b64[:80]}...")
    logger.info(f"PHOTO_EXT={ext}")
    return {"success": True, "message": "Photo uploaded", "photo_ext": ext, "photo_b64_preview": b64[:40] + "..."}

# ── CV endpoints ───────────────────────────────────────────────────────────────

@app.get("/cv")
def get_cv():
    """Return the CV PDF for download. 404 if not uploaded yet."""
    import json
    try:
        meta = json.loads(META_PATH.read_text()) if META_PATH.exists() else {}
    except Exception:
        meta = {}
    if not CV_PATH.exists():
        raise HTTPException(status_code=404, detail="No CV uploaded yet")
    filename = meta.get("cv_name", "Kemigisa_Suzan_CV.pdf")
    return FileResponse(CV_PATH, media_type="application/pdf",
                        headers={
                            "Content-Disposition": f'attachment; filename="{filename}"',
                            "Cache-Control": "public, max-age=3600"
                        })

@app.get("/cv/exists")
def cv_exists():
    """Returns whether a CV has been uploaded."""
    return {"exists": CV_PATH.exists()}

@app.post("/cv")
async def upload_cv(
    file: UploadFile = File(...),
    authorization: Optional[str] = Header(default=None),
):
    """Admin only — upload a new CV PDF."""
    require_admin(authorization)
    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    with CV_PATH.open("wb") as f:
        shutil.copyfileobj(file.file, f)
    import json
    meta = json.loads(META_PATH.read_text()) if META_PATH.exists() else {}
    meta["cv_name"] = file.filename
    META_PATH.write_text(json.dumps(meta))
    logger.info(f"CV uploaded: {file.filename}")
    return {"success": True, "message": "CV uploaded"}

# ── Admin export — get base64 values to paste into Vercel env vars ────────────

@app.get("/admin/export")
def admin_export(authorization: Optional[str] = Header(default=None)):
    """Returns base64-encoded photo and CV to paste into Vercel env vars."""
    require_admin(authorization)
    import json
    meta = {}
    try: meta = json.loads(META_PATH.read_text()) if META_PATH.exists() else {}
    except Exception: pass

    result = {}
    ext = meta.get("photo_ext", "")
    photo_path = UPLOAD_DIR / f"profile_photo{ext}"
    if photo_path.exists():
        result["PHOTO_BASE64"] = base64.b64encode(photo_path.read_bytes()).decode()
        result["PHOTO_EXT"] = ext

    if CV_PATH.exists():
        result["CV_BASE64"] = base64.b64encode(CV_PATH.read_bytes()).decode()
        result["CV_NAME"] = meta.get("cv_name", "Kemigisa_Suzan_CV.pdf")

    return result