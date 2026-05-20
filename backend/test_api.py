import requests
import time

BASE_URL = "http://127.0.0.1:8000"

def test_api():
    print("Waiting for server to start...")
    time.sleep(2)
    
    print("\n--- 1. Testing GET / (Root) ---")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status: {response.status_code}, Body: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

    print("\n--- 2. Testing GET /jobs (Scout Agent) ---")
    try:
        response = requests.get(f"{BASE_URL}/jobs")
        print(f"Status: {response.status_code}")
        for job in response.json():
            print(job)
    except Exception as e:
        print(f"Error: {e}")

    print("\n--- 3. Testing POST /jobs/negotiate (Negotiator Agent) ---")
    try:
        payload = {"job_id": 1, "worker_min_rate": 900.0} # Base is 800
        response = requests.post(f"{BASE_URL}/jobs/negotiate", json=payload)
        print(f"Payload: {payload}")
        print(f"Status: {response.status_code}, Body: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

    print("\n--- 4. Testing POST /employer/verify (Scam Hunter) ---")
    try:
        # Test a blacklisted number
        payload = {"employer_phone": "0001234567", "employer_name": "Shady Builder"}
        response = requests.post(f"{BASE_URL}/employer/verify", json=payload)
        print(f"Payload: {payload}")
        print(f"Status: {response.status_code}, Body: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

    print("\n--- 5. Testing POST /escrow/verify-work (Guardian System) ---")
    try:
        response = requests.post(f"{BASE_URL}/escrow/verify-work")
        print(f"Status: {response.status_code}, Body: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api()
