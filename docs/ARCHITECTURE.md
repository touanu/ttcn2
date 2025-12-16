# Tài liệu kiến trúc hệ thống

Tài liệu này mô tả kiến trúc tổng thể của hệ thống, bao gồm các thành phần chính,
cách chúng tương tác với nhau, và các nguyên tắc thiết kế cơ bản.

## Mục lục

---

## Tổng quan

To-do: Viết phần tổng quan về hệ thống, mục tiêu và phạm vi của tài liệu kiến trúc.

---

## Sơ đồ Use-case

```mermaid
flowchart LR
  rG["👤 Guest"]:::role
  rS["👤 Student"]:::role
  rT["👤 Teacher"]:::role
  rA["👤 Admin"]:::role
  rSys["🤖 System / Worker"]:::role

  subgraph S["Online English Learning Platform"]
    direction TB

    ucRegister([Register account])
    ucLogin([Login])
    ucProfile([Manage profile])

    ucBrowse([Browse courses])
    ucEnroll([Enroll in course])
    ucLearn([Watch lessons])
    ucQuiz([Take quiz / assessment])
    ucProgress([Track progress])

    ucCreateC([Create / Edit course])
    ucUpload([Upload videos / lessons])
    ucGrade([Grade submissions])
    ucLive([Host live class])

    ucManageUsers([Manage users])
    ucManageCourses([Manage courses])
    ucReports([View system reports])

    ucNotify([Send notifications])
    ucJobs([Process background jobs])
    ucTranscode([Transcode videos])
  end

  rG --- ucRegister
  rG --- ucLogin
  rG --- ucBrowse

  rS --- ucLogin
  rS --- ucProfile
  rS --- ucBrowse
  rS --- ucEnroll
  rS --- ucLearn
  rS --- ucQuiz
  rS --- ucProgress

  rT --- ucLogin
  rT --- ucProfile
  rT --- ucCreateC
  rT --- ucUpload
  rT --- ucGrade
  rT --- ucLive

  rA --- ucManageUsers
  rA --- ucManageCourses
  rA --- ucReports

  rSys --- ucNotify
  rSys --- ucJobs
  rSys --- ucTranscode

  ucEnroll -. include .-> ucBrowse
  ucLearn -. include .-> ucEnroll
  ucQuiz -. include .-> ucLearn
  ucProgress -. include .-> ucQuiz
  ucUpload -. include .-> ucCreateC
  ucGrade -. include .-> ucQuiz
  ucTranscode -. include .-> ucUpload
  ucNotify -. include .-> ucJobs

  classDef role stroke-width:0px;
```

---

## Kiến trúc hệ thống

### Kiến trúc cấp cao

```mermaid
graph TB
    subgraph "Client"
        WB[Web Browser]
        MB[Mobile Browser]
    end

    subgraph "Frontend"
        Nuxt[Nuxt Application]
        VueC[Vue Components]
        Nitro[Nitro Server]
        HTTPC[HTTP Client]
    end

    subgraph "Backend"
        Express[Express REST Framework]
        Logic[Business Logic]
    end

    subgraph "Data Layer"
        Mongo[(MongoDB)]
    end

    subgraph "External Services"
        Atlas[MongoDB Atlas]
    end

    WB --> Nuxt
    MB --> Nuxt
    Nuxt --> VueC
    Nuxt --> Nitro
    Nitro --> HTTPC
    HTTPC --> Express
    Express --> Logic
    Logic --> Mongo
    Mongo -.-> Atlas
```

### Các lớp kiến trúc

```mermaid
graph
    subgraph "Presentation"
        Vue[Vue Components]
    end

    subgraph "Service"
        Nuxt[Nuxt Application]
        Pinia[State Management]
        Nitro[Nitro Server]
        HTTP[HTTP Client]
    end

    subgraph "API"
        REST[REST Endpoints]
        Auth[Authentication Middleware]
        CORS[CORS Middleware]
        Valid[Validation Middleware]
    end

    subgraph "Business Logic"
        CRUD
        Perm[Permissions & Authorization]
    end

    subgraph "Data Access"
        Mongoose[Mongoose Models]
    end

    subgraph "Infrasture"
        MongoDB
    end

    Vue --> Nuxt
    Nuxt --> Nitro
    Nitro --> HTTP
    HTTP --> REST
    REST --> Auth
    Auth --> CORS
    CORS --> Valid
    Valid --> CRUD
    CRUD --> Perm
    Perm --> Mongoose
    Mongoose --> MongoDB
```

---

## Các công nghệ chính

```mermaid
%% Todo: Sửa lại biểu đồ này khi dự án đã hoàn thiện hơn
flowchart TB
  subgraph FE["Frontend"]
    FE1[Nuxt 3]
    FE2[TypeScript]
    FE3[Pinia]
  end

  subgraph BE["Backend"]
    BE1[NodeJS]
    BE2[Express]
  end

  subgraph DB["Database"]
    DB1[(MongoDB)]
  end

  subgraph ST["Storage"]
    ST1[S3 or Cloud Storage]
  end

  subgraph RT["Realtime"]
    RT1[Socket.io]
  end

  subgraph INF["DevOps"]
    INF1[Docker]
    INF2[CI/CD]
    INF3[Monitoring]
  end

  FE --> BE
  BE --> DB
  BE --> ST
  BE --> RT
  BE --> INF
```

---

## Lược đồ cơ sở dữ liệu

```mermaid
%% Chưa phải là lược đồ hoàn chỉnh, cần bổ sung thêm khi có yêu cầu cụ thể hơn
erDiagram

  USER {
    ObjectId _id PK
    string username UK
    string email UK
    bool isEmailVerified
    string passwordHash
    string fullName
    string phoneNumber
    bool isPhoneVerified
    string role
    string profilePicture
    date createdAt
    date updatedAt
  }

  SESSION {
    ObjectId _id
    ObjectId userId
    string refreshTokenHash
    string ipAddress
    string userAgent
    string deviceInfo
    bool revoked
    date revokedAt
    date createdAt
    date updatedAt
  }

  COURSE {
    ObjectId _id
    string title
    string description
    string thumbnail
    string level
    string[] lessonIds
    string authorId
    date createdAt
    date updatedAt
  }

  LESSON {
    ObjectId _id
    string courseId
    string title
    string content
    string[] mediaIds
    string quizId
    number orderIndex
    date createdAt
    date updatedAt
  }

  QUIZ {
    ObjectId _id
    string lessonId
    string[] questionIds
  }

  QUESTION {
    string _id
    string quizId
    string type
    string prompt
    string[] choices
    string correctAnswer
  }

  ATTEMPT {
    ObjectId _id
    string userId
    string quizId
    number score
    json answers
    date createdAt
  }

  PROGRESS {
    ObjectId _id
    string userId
    string courseId
    string[] completedLessonIds
    number percentage
    date updatedAt
  }

  MEDIA {
    ObjectId _id
    string url
    string type
    string ownerId
    date createdAt
  }

  USER ||--o{ SESSION : has
  USER ||--o{ COURSE : creates
  COURSE ||--o{ LESSON : contains
  LESSON ||--o{ MEDIA : uses
  LESSON ||--o| QUIZ : has
  QUIZ ||--o{ QUESTION : includes
  USER ||--o{ ATTEMPT : submits
  USER ||--o{ PROGRESS : tracks
  COURSE ||--o{ PROGRESS : progress_in
```

---

## Mô hình API

### RESTful API Endpoints

```mermaid
graph LR
  %% Chưa phải là lược đồ hoàn chỉnh, cần bổ sung thêm khi có yêu cầu cụ thể hơn
    subgraph "Authentication"
        A[POST /auth/register]
        B[POST /auth/login]
        C[POST /auth/logout]
        D[POST /auth/refresh]
        E[POST /auth/verify-email-otp]
        ZAC[POST /auth/verify-email-token]
        F[POST /auth/forgot-password]
        G[POST /auth/reset-password]
        H[GET /users/me]
    end

    subgraph "User Management"
        I[GET /users]
        J[POST /users]
        K[GET /users/:id]
        L[PATCH /users/:id]
        M[DELETE /users/:id]
        N[PATCH /users/me/avatar]
    end

    subgraph "Course Management"
        O[GET /courses]
        P[POST /courses]
        Q[GET /courses/:id]
        R[PATCH /courses/:id]
        S[DELETE /courses/:id]
        T[GET /courses/:id/lessons]
    end

    subgraph "Lesson Management"
        U[POST /courses/:id/lessons]
        V[GET /lessons/:id]
        W[PATCH /lessons/:id]
        X[DELETE /lessons/:id]
    end

    subgraph "Quiz & Question"
        Y[GET /lessons/:id/quizzes]
        Z[POST /lessons/:id/quizzes]
        ZA[GET /quizzes/:id]
        ZB[PATCH /quizzes/:id]
        ZC[DELETE /quizzes/:id]
        ZD[POST /quizzes/:id/questions]
        ZE[GET /questions/:id]
        ZF[PATCH /questions/:id]
        ZG[DELETE /questions/:id]
    end

    subgraph "Submissions"
        ZH[POST /quizzes/:id/submissions]
        ZI[GET /submissions/:id]
        ZJ[GET /users/me/submissions]
    end

    subgraph "Progress"
        ZK[GET /progress/me]
        ZL[GET /progress/courses/:id]
        ZM[POST /progress/lessons/:id/complete]
    end

    subgraph "Media"
        ZN[POST /upload/avatar]
        ZO[POST /upload/audio]
        ZP[POST /upload/material]
    end

    subgraph "Chat"
        ZQ[GET /chat/rooms]
        ZR[POST /chat/rooms]
        ZS[GET /chat/rooms/:id/messages]
    end

    subgraph "Live Class"
        ZT[POST /live/create-session]
        ZU[GET /live/:id]
        ZV[POST /live/:id/join]
    end

    subgraph "Subscription & Payments"
        ZW[GET /plans]
        ZX[POST /subscriptions]
        ZY[GET /subscriptions/me]
        ZZ[POST /payments/webhook]
    end

    subgraph "Admin"
        ZAA[GET /admin/dashboard]
        ZAB[GET /admin/users]
        ZAC[GET /admin/courses]
        ZAD[GET /admin/payments]
    end
```

### BFF Endpoints

To-do: Cập nhật sau

### Luồng giao tiếp chính

```mermaid
sequenceDiagram
    participant Client
    participant NGINX
    participant Express
    participant MongoDB

    Client->>NGINX: HTTP Request
    NGINX->>Express: Forward Request

    alt Authentication Required
        Express->>MongoDB: Verify Token
        MongoDB-->>Express: Token Valid
    end

    Express->>MongoDB: Query Data
    MongoDB-->>Express: Data Result
    Express-->>Client: Response
```

---
