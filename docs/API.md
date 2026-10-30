# REST API Specification

Base URL: `http://localhost:3000`  
Standard Headers:
- `Content-Type: application/json`
- `Authorization: Bearer <jwt_access_token>` (for protected endpoints)

---

## 1. Authentication Endpoints

### 1.1 Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth Required**: No (Public)
- **Request Body**:
```json
{
  "email": "student@itc.edu.kh",
  "password": "Password123",
  "fullName": "SOK Vireak",
  "role": "STUDENT",
  "studentIdNumber": "e20231270"
}
```
- **Responses**:
  - `201 Created`:
  ```json
  {
    "id": 1,
    "email": "student@itc.edu.kh",
    "fullName": "SOK Vireak",
    "role": "STUDENT",
    "studentIdNumber": "e20231270",
    "createdAt": "2026-10-30T07:00:00.000Z"
  }
  ```
  - `400 Bad Request`:
  ```json
  {
    "statusCode": 400,
    "message": "Email already registered"
  }
  ```

### 1.2 Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth Required**: No (Public)
- **Request Body**:
```json
{
  "email": "student@itc.edu.kh",
  "password": "Password123"
}
```
- **Responses**:
  - `200 OK`:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "student@itc.edu.kh",
      "fullName": "SOK Vireak",
      "role": "STUDENT",
      "studentIdNumber": "e20231270"
    }
  }
  ```
  - `401 Unauthorized`:
  ```json
  {
    "statusCode": 401,
    "message": "Invalid credentials"
  }
  ```

---

## 2. Internship Application Endpoints

### 2.1 List Applications
- **URL**: `/applications`
- **Method**: `GET`
- **Auth Required**: Yes (`STUDENT` or `ADVISOR`)
- **Query Parameters**:
  - `page` (integer, default: 1)
  - `limit` (integer, default: 5)
  - `search` (string, optional, matches companyName or positionTitle case-insensitively)
  - `status` (string, optional, `DRAFT`, `APPLIED`, `INTERVIEWING`, `OFFERED`, `APPROVED`, `REJECTED`)
- **Behavior**:
  - `STUDENT`: Returns only applications owned by the requesting student.
  - `ADVISOR`: Returns all students' applications across the department.
- **Responses**:
  - `200 OK`:
  ```json
  {
    "data": [
      {
        "id": 1,
        "studentId": 1,
        "companyName": "Canadia Bank IT",
        "positionTitle": "Frontend Engineer Intern",
        "location": "Phnom Penh",
        "stipend": 250.0,
        "status": "APPLIED",
        "startDate": "2026-12-01T00:00:00.000Z",
        "endDate": "2027-03-01T00:00:00.000Z",
        "createdAt": "2026-10-30T07:15:00.000Z",
        "updatedAt": "2026-10-30T07:15:00.000Z",
        "student": {
          "id": 1,
          "fullName": "SOK Vireak",
          "email": "student@itc.edu.kh",
          "studentIdNumber": "e20231270"
        },
        "_count": {
          "reviews": 0
        }
      }
    ],
    "totalItems": 1,
    "totalPages": 1,
    "currentPage": 1
  }
  ```

### 2.2 Create Application
- **URL**: `/applications`
- **Method**: `POST`
- **Auth Required**: Yes (`STUDENT` only, Advisor receives 403 Forbidden)
- **Request Body**:
```json
{
  "companyName": "Smart Axiata",
  "positionTitle": "Junior DevOps Intern",
  "location": "Phnom Penh",
  "stipend": 300,
  "status": "DRAFT",
  "startDate": "2026-11-15T00:00:00.000Z",
  "endDate": "2027-02-15T00:00:00.000Z"
}
```
- **Responses**:
  - `201 Created`
  - `400 Bad Request` ("End date must be after start date" or validation failure)
  - `403 Forbidden` (If attempted by Advisor)

### 2.3 Get Application Detail
- **URL**: `/applications/:id`
- **Method**: `GET`
- **Auth Required**: Yes (`STUDENT` own, or `ADVISOR` all)
- **Responses**:
  - `200 OK` (includes chronological list of `reviews` sorted oldest first)
  - `404 Not Found` (If student attempts to access another student's application — IDOR prevention)

### 2.4 Update Application
- **URL**: `/applications/:id`
- **Method**: `PATCH`
- **Auth Required**: Yes (`STUDENT` own)
- **Responses**:
  - `200 OK`
  - `403 Forbidden` ("Approved applications cannot be modified")
  - `404 Not Found` (If student does not own application)

### 2.5 Delete Application
- **URL**: `/applications/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (`STUDENT` own)
- **Constraints**:
  - Only applications in `DRAFT` or `APPLIED` status with 0 reviews can be deleted.
- **Responses**:
  - `204 No Content`
  - `403 Forbidden` ("Cannot delete application with existing reviews")
  - `404 Not Found` (If student does not own application)

---

## 3. Review Endpoints

### 3.1 Create Advisor Review
- **URL**: `/applications/:id/reviews`
- **Method**: `POST`
- **Auth Required**: Yes (`ADVISOR` only)
- **Request Body**:
```json
{
  "comment": "Good company and project scope. Approved for 4 academic credits.",
  "decision": "APPROVED"
}
```
- **Responses**:
  - `201 Created`: returns review and atomically updates parent application status if `APPROVED` or `REJECTED`.
  - `400 Bad Request`: comment < 10 characters or invalid decision value.
  - `403 Forbidden`: if student attempts to submit review.
  - `404 Not Found`: if application does not exist.
