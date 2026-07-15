# KSP Crime Intelligence Copilot: API Integration Guide

Welcome to the backend API reference guide for the Karnataka State Police (KSP) Crime Intelligence Copilot. This document provides detail on the available Zoho Catalyst serverless endpoints, their expected request parameters, and response structures.

All API routes are served relative to the local gateway at `http://localhost:3000/server` or your deployed Zoho Catalyst production URL.

---

## Base API Envelope
All API responses follow a unified envelope format:

```json
{
  "success": true,
  "data": { ... } // Payload here
}
```

In case of errors (4xx or 5xx status codes):
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error description."
  }
}
```

---

## 1. Case Management (`/cases`)

### Get Cases List
Retrieve a paginated list of FIR cases with optional searching and filtering.

*   **Endpoint:** `GET /server/cases`
*   **Query Parameters:**
    *   `limit`: Number of cases per page (default: `10`, max: `100`)
    *   `offset`: Page offset index (default: `0`)
    *   `search`: Search string matching FIR numbers, accused names, or summaries.
    *   `district`: Filter by District ROWID
    *   `status`: Filter by CaseStatusMaster ROWID
    *   `category`: Filter by CaseCategory ROWID
*   **Response:**
    ```json
    {
      "success": true,
      "data": {
        "cases": [
          {
            "ROWID": "1784132898881",
            "fir_number": "JayanagarPS/0001/2026",
            "crime_registered_date": "2026-05-12 14:30:00",
            "place_of_occurrence": "Jayanagar 4th Block, near Bus Stand (FIR: JayanagarPS/0001/2026)",
            "summary_of_facts": "...",
            "fir_status": "Approved",
            "status_name": "Under Investigation",
            "category_name": "Theft"
          }
        ],
        "total": 300,
        "limit": 10,
        "offset": 0
      }
    }
    ```

### Get Case Details
Fetch comprehensive details for a specific FIR, including victim, complainant, accused, arrest, and chargesheet details.

*   **Endpoint:** `GET /server/cases/:id`
*   **Response:**
    ```json
    {
      "success": true,
      "data": {
        "case": {
          "ROWID": "1784132898881",
          "fir_number": "JayanagarPS/0001/2026",
          "crime_registered_date": "2026-05-12 14:30:00",
          "place_of_occurrence": "...",
          "summary_of_facts": "..."
        },
        "complainants": [
          {
            "name": "Rajesh Kumar",
            "age": 42,
            "gender": "Male",
            "phone": "9845012345",
            "address": "..."
          }
        ],
        "victims": [
          {
            "name": "Kavitha R",
            "age": 38,
            "gender": "Female"
          }
        ],
        "accused": [
          {
            "name": "Manju alias Loose Manja",
            "age": 28,
            "gender": "Male",
            "status": "Arrested"
          }
        ],
        "arrests": [
          {
            "event_type": "Arrested",
            "date_time": "2026-05-13 10:00:00",
            "place": "Jayanagar Metro Station"
          }
        ],
        "chargesheets": [
          {
            "chargesheet_number": "CS-01/2026",
            "date_filed": "2026-06-15",
            "final_report_type": "Chargesheeted"
          }
        ]
      }
    }
    ```

---

## 2. Analytics Dashboard (`/analytics`)

### Get Dashboard Statistics
Fetch aggregate counts and metrics for the main officer dashboard.

*   **Endpoint:** `GET /server/analytics/dashboard`
*   **Response:**
    ```json
    {
      "success": true,
      "data": {
        "totalCases": 300,
        "solvedRate": 68.4,
        "activeInvestigations": 92,
        "heinousCount": 42,
        "casesByCategory": [
          { "category_name": "Theft", "count": 87 },
          { "category_name": "Murder", "count": 22 }
        ],
        "hotspots": [
          { "district_name": "Bengaluru Urban", "count": 108 }
        ]
      }
    }
    ```

---

## 3. Hotspot Mapping (`/map`)

### Get Hotspot Coordinates
Retrieve coordinates and weights for density maps or heatmap visualizers.

*   **Endpoint:** `GET /server/map/hotspots`
*   **Response:**
    ```json
    {
      "success": true,
      "data": {
        "points": [
          {
            "latitude": 12.971598,
            "longitude": 77.594566,
            "weight": 5.0,
            "fir_number": "JayanagarPS/0001/2026"
          }
        ]
      }
    }
    ```

---

## 4. Intel Network Graph (`/graph`)

### Get Case Graph
Fetch nodes and links for rendering force-directed network graphs (D3.js or Vis.js).

*   **Endpoint:** `GET /server/graph/case/:caseId`
*   **Response:**
    ```json
    {
      "success": true,
      "data": {
        "nodes": [
          { "id": "case_1784132898881", "label": "FIR: JayanagarPS/0001/2026", "group": "case" },
          { "id": "accused_90001", "label": "Loose Manja (Accused)", "group": "accused" },
          { "id": "victim_80001", "label": "Kavitha R (Victim)", "group": "victim" }
        ],
        "links": [
          { "source": "case_1784132898881", "target": "accused_90001", "type": "CHARGED" },
          { "source": "case_1784132898881", "target": "victim_80001", "type": "VICTIM_OF" }
        ]
      }
    }
    ```

---

## 5. NLP Copilot Assistant (`/assistant`)

### Post Assistant Query
Query the copilot regarding cases using natural language.

*   **Endpoint:** `POST /server/assistant/query`
*   **Request Body:**
    ```json
    {
      "query": "Summarize property theft cases in Bengaluru Urban during 2026"
    }
    ```
*   **Response:**
    ```json
    {
      "success": true,
      "data": {
        "answer": "Based on the database, there are **14 theft cases** registered in Bengaluru Urban for 2026. The most prominent is FIR `JayanagarPS/0001/2026` involving Loose Manja...",
        "citations": ["JayanagarPS/0001/2026", "KoramangalaPS/0004/2026"]
      }
    }
    ```

---

## 6. PDF Reports (`/reports`)

### Generate PDF Case Summary
Triggers the generation of a downloadable PDF report for a case.

*   **Endpoint:** `POST /server/reports/case/:caseId`
*   **Response:**
    ```json
    {
      "success": true,
      "data": {
        "reportId": "REP-9981",
        "downloadUrl": "https://catalyst.zoho.com/filestore/REP-9981.pdf"
      }
    }
    ```

---

## 7. Kannada Voice Transcription & Translation (`/voice`)

### Transcribe & Translate Voice Memo
Transcribe Kannada audio statements and translate them to English.

*   **Endpoint:** `POST /server/voice/transcribe`
*   **Headers:** `Content-Type: multipart/form-data`
*   **Form-Data Body:**
    *   `audio`: (File buffer, `.wav`/`.mp3`/`.m4a`)
*   **Response:**
    ```json
    {
      "success": true,
      "data": {
        "transcription": "ನಾನು ನಿನ್ನೆ ರಾತ್ರಿ ನನ್ನ ಬೈಕನ್ನು ಕಳೆದುಕೊಂಡೆ (I lost my bike last night)",
        "translation": "I lost my bike last night",
        "detectedLanguage": "kn"
      }
    }
    ```

---

## 8. Role-Based Access Control Headers (Local Emulation)
To test different roles during local frontend development, include the following custom header in your Axios or fetch requests:

*   **Header Name:** `x-user-role`
*   **Supported Values:**
    *   `admin`: Full access to all dashboards and seeding.
    *   `investigator`: Access to cases, graph, voice, and assistant.
    *   `analyst`: Access to analytics, hotspots, maps, and graph.
    *   `viewer`: Read-only access to dashboard statistics.

**Example Fetch Call:**
```javascript
const response = await fetch('http://localhost:3000/server/cases', {
  headers: {
    'x-user-role': 'investigator'
  }
});
const data = await response.json();
```
