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
erDiagram

  USER {
    ObjectId _id PK
    string username UK
    string email UK
    bool isEmailVerified
    string password
    string fullName
    string role
    string profilePictureUrl
    date createdAt
    date updatedAt
  }

  SESSION {
    ObjectId _id PK
    ObjectId userId FK
    string refreshTokenHash
    string ipAddress
    string userAgent
    string deviceInfo
    bool revoked
    date revokedAt
    date expiresAt
    date createdAt
    date updatedAt
  }

  OTP {
    ObjectId _id PK
    ObjectId userId FK
    string otpHash
    string verificationToken UK
    string otpType
    bool used
    date createdAt
  }

  MEDIA {
    ObjectId _id PK
    string url
    string type
    ObjectId ownerId FK
    date createdAt
  }

  COURSE_CATEGORY {
    ObjectId _id PK
    string name
    string description
    date createdAt
  }

  COURSE {
    ObjectId _id PK
    string title
    string description
    string thumbnail
    ObjectId authorId FK
    ObjectId categoryId FK
    string level
    string status
    ObjectId[] lessonIds
    ObjectId[] classIds
    date createdAt
    date updatedAt
  }

  CLASS {
    ObjectId _id PK
    string name
    ObjectId courseId FK
    ObjectId teacherId FK
    ObjectId[] studentIds
    string room
    string description
    number maxStudents
    string status
    date startDate
    date endDate
    date openedAt
    date endedAt
    date createdAt
    date updatedAt
  }

  TIME_TABLE {
    ObjectId _id PK
    ObjectId classId FK
    number dayOfWeek
    date startTime
    date endTime
    string description
    date createdAt
    date updatedAt
  }

  ENROLLMENT {
    ObjectId _id PK
    ObjectId userId FK
    ObjectId courseId FK
    string status
    number price
    number paidPrice
    string paidMethod
    number progressPercentage
    date enrolledAt
    date completedAt
    date createdAt
    date updatedAt
  }

  PROGRESS {
    ObjectId _id PK
    ObjectId userId FK
    ObjectId courseId FK
    ObjectId[] completedLessonIds
    number percentage
    date updatedAt
  }

  USER ||--o{ SESSION : has
  USER ||--o{ OTP : for_verification
  USER ||--o{ MEDIA : owns
  USER ||--o{ COURSE : creates
  USER ||--o{ CLASS : teaches
  USER ||--o{ ENROLLMENT : enrolls_in
  USER ||--o{ PROGRESS : tracks

  COURSE ||--o{ COURSE_CATEGORY : belongs_to
  COURSE ||--o{ CLASS : has_classes
  COURSE ||--o{ ENROLLMENT : has_enrollments
  COURSE ||--o{ PROGRESS : progress_in

  CLASS ||--o{ TIME_TABLE : has_schedule
  CLASS ||--o{ USER : has_students

  ENROLLMENT ||--o{ PROGRESS : tracks_progress
```

---

## Mô hình API

### RESTful API Endpoints

```mermaid
graph LR
  %% Chưa phải là lược đồ hoàn chỉnh, cần bổ sung thêm khi có yêu cầu cụ thể hơn
    subgraph "Authentication"
        B[POST /auth/login]
        C[POST /auth/logout]
        D[POST /auth/refresh]
    end

    subgraph "User Management"
        I[GET /users]
        J[POST /users]
        K[GET /users/:id]
        L[PATCH /users/:id]
        M[DELETE /users/:id]
        N[PATCH /users/me/avatar]
        A[POST /users/register]
        E[POST /users/verify-email-otp]
        ZAC[POST /users/verify-email-token]
        F[POST /users/forgot-password]
        G[POST /users/reset-password]
        H[GET /users/me]
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
