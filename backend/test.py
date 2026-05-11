"""
Tests for the portfolio contact API.
All external dependencies (SMTP) are mocked — no real emails sent.

Run:  pytest test_contact.py -v
"""

import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

VALID_FORM = {
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Job opportunity",
    "message": "Hello Suzan, I would love to work with you on an AI project.",
}


# ── Health checks ─────────────────────────────────────────────────────────────

def test_root():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"


# ── Happy path ────────────────────────────────────────────────────────────────

@patch("main.smtplib.SMTP")
@patch.dict("os.environ", {"SMTP_USER": "test@gmail.com", "SMTP_PASSWORD": "testpass", "TO_EMAIL": "test@gmail.com"})
def test_contact_success(mock_smtp):
    mock_server = MagicMock()
    mock_smtp.return_value.__enter__.return_value = mock_server

    res = client.post("/contact", json=VALID_FORM)

    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "24" in data["message"]
    mock_server.send_message.assert_called()


# ── Validation errors ─────────────────────────────────────────────────────────

def test_contact_short_name():
    form = {**VALID_FORM, "name": "A"}
    res = client.post("/contact", json=form)
    assert res.status_code == 422

def test_contact_short_message():
    form = {**VALID_FORM, "message": "Hi"}
    res = client.post("/contact", json=form)
    assert res.status_code == 422

def test_contact_invalid_email():
    form = {**VALID_FORM, "email": "not-an-email"}
    res = client.post("/contact", json=form)
    assert res.status_code == 422

def test_contact_missing_fields():
    res = client.post("/contact", json={"name": "Test"})
    assert res.status_code == 422


# ── SMTP errors ───────────────────────────────────────────────────────────────

@patch("main.smtplib.SMTP")
@patch.dict("os.environ", {"SMTP_USER": "test@gmail.com", "SMTP_PASSWORD": "badpass", "TO_EMAIL": "test@gmail.com"})
def test_contact_smtp_auth_error(mock_smtp):
    import smtplib
    mock_smtp.return_value.__enter__.side_effect = smtplib.SMTPAuthenticationError(535, b"Bad credentials")

    res = client.post("/contact", json=VALID_FORM)
    assert res.status_code == 500
    assert "authentication" in res.json()["detail"].lower()

@patch("main.send_email")
@patch.dict("os.environ", {"SMTP_USER": "", "SMTP_PASSWORD": ""})
def test_contact_missing_credentials(mock_send):
    mock_send.side_effect = RuntimeError("SMTP credentials not configured. Check your .env file.")
    res = client.post("/contact", json=VALID_FORM)
    assert res.status_code == 500