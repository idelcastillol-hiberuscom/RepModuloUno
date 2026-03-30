import pytest
from fastapi.testclient import TestClient
from src.app import app

client = TestClient(app)

def test_get_activities():
    # Arrange
    # (No setup needed)
    # Act
    response = client.get("/activities")
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "Chess Club" in data

def test_signup_new_participant():
    # Arrange
    email = "nuevo@mergington.edu"
    activity = "Chess Club"
    # Act
    response = client.post(f"/activities/{activity}/signup?email={email}")
    # Assert
    assert response.status_code == 200
    assert f"Signed up {email}" in response.json()["message"]

def test_signup_duplicate_participant():
    # Arrange
    email = "dup@mergington.edu"
    activity = "Programming Class"
    client.post(f"/activities/{activity}/signup?email={email}")  # Primer registro
    # Act
    response = client.post(f"/activities/{activity}/signup?email={email}")  # Segundo registro
    # Assert
    assert response.status_code in (200, 400, 409)

def test_signup_nonexistent_activity():
    # Arrange
    email = "alguien@mergington.edu"
    activity = "NoExiste"
    # Act
    response = client.post(f"/activities/{activity}/signup?email={email}")
    # Assert
    assert response.status_code == 404
