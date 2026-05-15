Kamu adalah software architect senior, AI engineer profesional, dan fullstack engineer expert.

Bangun aplikasi FULLSTACK production-ready bernama:

AI ESSAY EVALUATOR

Menggunakan:

BACKEND:

- FastAPI
- PostgreSQL
- SQLAlchemy ORM
- Alembic migration
- Pydantic schema validation
- JWT Authentication
- Async FastAPI
- Groq API GRATIS sebagai LLM provider

FRONTEND:

- Next.js latest App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod validation
- Axios
- Shadcn UI

==================================================
TUJUAN SISTEM
==================================================

Sistem AI akademik untuk mengevaluasi essay secara profesional.

User dapat:

1. Register dan login
2. Upload file essay PDF atau DOCX
3. Sistem membaca isi file
4. Sistem mengevaluasi kualitas essay menggunakan AI
5. Sistem memberikan:
   - skor numerik 0–100
   - grade kualitas
   - subscore per kategori
   - feedback detail
   - kelemahan essay
   - saran perbaikan
6. Semua hasil disimpan ke PostgreSQL
7. User dapat melihat history evaluasi

Sistem HARUS terasa:

- profesional
- akademis
- modern
- premium
- stabil
- production-ready basic

==================================================
ARSITEKTUR YANG DIINGINKAN
==================================================

Gunakan clean modular architecture.

==================================================
STRUKTUR BACKEND
==================================================

backend/
│
├── app/
│ ├── main.py
│ │
│ ├── core/
│ │ ├── config.py
│ │ ├── database.py
│ │ ├── security.py
│ │ ├── logging.py
│ │ └── exceptions.py
│ │
│ ├── api/
│ │ ├── deps.py
│ │ └── routes/
│ │ ├── auth.py
│ │ ├── essays.py
│ │ └── health.py
│ │
│ ├── models/
│ │ ├── user.py
│ │ └── essay.py
│ │
│ ├── schemas/
│ │ ├── auth.py
│ │ ├── essay.py
│ │ └── common.py
│ │
│ ├── repositories/
│ │ ├── user_repository.py
│ │ └── essay_repository.py
│ │
│ ├── services/
│ │ ├── groq_service.py
│ │ ├── essay_service.py
│ │ ├── scoring_service.py
│ │ ├── pdf_service.py
│ │ ├── docx_service.py
│ │ └── auth_service.py
│ │
│ ├── prompts/
│ │ └── essay_prompt.py
│ │
│ ├── middleware/
│ │ ├── logging.py
│ │ └── rate_limit.py
│ │
│ └── utils/
│ ├── validators.py
│ ├── text_cleaner.py
│ ├── chunking.py
│ └── filename.py
│
├── alembic/
├── requirements.txt
├── .env
└── alembic.ini

==================================================
DATABASE
==================================================

Gunakan PostgreSQL.

Gunakan:

- SQLAlchemy ORM
- AsyncSession
- Alembic migration

Buat tabel:

1. users
2. essay_evaluations

==================================================
TABLE users
==================================================

- id
- name
- email
- hashed_password
- created_at

==================================================
TABLE essay_evaluations
==================================================

- id
- user_id
- original_filename
- extracted_text
- final_score
- grade
- summary
- subscores (JSON)
- strengths (JSON)
- weaknesses (JSON)
- suggestions (JSON)
- detailed_feedback (JSON)
- created_at

==================================================
FASTAPI VALIDATION
==================================================

WAJIB menggunakan:

- Pydantic schemas
- Request validation
- Response validation

Gunakan schema terpisah:

- Create schema
- Response schema
- Internal schema

Semua endpoint HARUS:

- memakai response_model
- validasi input
- validasi response
- memiliki error handling konsisten

==================================================
AUTHENTICATION
==================================================

Gunakan JWT Authentication.

Fitur:

- register
- login
- protected routes
- current user endpoint

Gunakan:

- bcrypt password hashing
- access token
- bearer auth

==================================================
FILE VALIDATION
==================================================

Hanya izinkan:

- PDF
- DOCX

Tambahkan:

- file size limit
- mime validation
- sanitize filename
- empty text detection
- unsupported file validation

Jika PDF hasil scan dan text kosong:
return validation error proper.

==================================================
ESSAY AI PIPELINE
==================================================

JANGAN langsung kirim raw text ke AI.

Gunakan pipeline profesional:

STEP 1:
Extract text

STEP 2:
Clean text

- remove weird characters
- normalize spaces
- normalize paragraphs

STEP 3:
Analyze essay structure

- introduction
- body
- conclusion

STEP 4:
Chunking jika text terlalu panjang

STEP 5:
Rubric-based scoring

STEP 6:
Generate structured academic feedback

==================================================
RUBRIC SCORING SYSTEM
==================================================

Gunakan scoring berbobot:

- Struktur essay → 20%
- Kejelasan argumen → 20%
- Koherensi → 15%
- Analisis dan kedalaman → 20%
- Grammar dan vocabulary → 15%
- Relevansi topik → 10%

AI HARUS:

- memberi subscore tiap kategori
- memberi alasan tiap subscore
- menghitung weighted final score

==================================================
FORMAT OUTPUT AI
==================================================

WAJIB JSON VALID.

{
"final_score": 82,
"grade": "Baik",
"summary": "...",
"subscores": {
"structure": {
"score": 80,
"reason": "..."
},
"argumentation": {
"score": 85,
"reason": "..."
},
"coherence": {
"score": 78,
"reason": "..."
},
"analysis": {
"score": 88,
"reason": "..."
},
"grammar": {
"score": 74,
"reason": "..."
},
"relevance": {
"score": 90,
"reason": "..."
}
},
"strengths": [],
"weaknesses": [],
"suggestions": [],
"detailed_feedback": [
{
"aspect": "Grammar",
"problem": "...",
"improvement": "..."
}
]
}

==================================================
RULE GRADE
==================================================

0–39 = Sangat Buruk
40–54 = Buruk
55–69 = Cukup
70–84 = Baik
85–100 = Sangat Baik

==================================================
GROQ API
==================================================

Gunakan:

- llama-3.3-70b-versatile
  ATAU model Groq gratis terbaik terbaru.

Gunakan:

- retry mechanism
- timeout
- response validation
- invalid JSON retry handling

Gunakan:
GROQ_API_KEY dari environment variable.

==================================================
PROMPT AI EVALUATOR
==================================================

AI HARUS:

- bertindak sebagai evaluator essay akademik profesional
- kritis tetapi konstruktif
- tidak terlalu murah memberi nilai tinggi
- tidak hanya merangkum essay
- menjelaskan kelemahan secara spesifik
- memberi saran yang actionable
- mengevaluasi secara objektif

Fokus evaluasi:

- struktur
- argumentasi
- koherensi
- grammar
- kualitas analisis
- relevansi topik
- kejelasan penulisan

==================================================
SECURITY
==================================================

Tambahkan:

- JWT auth
- CORS
- rate limiting basic
- file validation
- env secrets
- SQL injection prevention
- centralized exception handling

==================================================
ERROR HANDLING
==================================================

Gunakan global exception handler.

Return response konsisten:

{
"success": false,
"message": "...",
"error_code": "..."
}

==================================================
BEST PRACTICES
==================================================

Gunakan:

- async/await
- repository pattern
- service layer
- dependency injection FastAPI
- environment config
- middleware logging
- modular code
- maintainable structure

==================================================
FRONTEND REQUIREMENTS
==================================================

Gunakan:

- Next.js latest App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod validation
- Axios
- Shadcn UI

==================================================
HALAMAN FRONTEND
==================================================

Buat:

1. Login Page
2. Register Page
3. Dashboard
4. Upload Essay Page
5. Evaluation Result Page
6. History Page
7. Detail Evaluation Page

==================================================
FITUR FRONTEND
==================================================

Tambahkan:

- drag and drop upload
- loading animation
- upload progress
- toast notification
- score visualization
- responsive layout
- protected routes
- skeleton loading
- elegant error state

==================================================
INSTRUKSI TAMPILAN / UI-UX
==================================================

Buat frontend yang terlihat:

- modern
- premium
- elegan
- akademis
- profesional
- tidak berantakan
- tidak terlihat seperti template AI generik
- terasa mahal dan serius seperti aplikasi SaaS kampus / riset / evaluator akademik

==================================================
VISUAL STYLE
==================================================

- Gunakan visual clean dan minimal
- Hindari warna neon
- Hindari glow berlebihan
- Hindari gaya futuristik berlebihan
- Gunakan warna:
  - putih
  - off-white
  - slate
  - navy
  - abu netral
  - accent tipis emerald atau gold lembut

Gunakan:

- whitespace luas
- rounded card modern
- border tipis
- soft shadow
- typography rapi

==================================================
TYPOGRAPHY
==================================================

Gunakan:

- font modern dan profesional
- hierarki heading jelas
- readability tinggi
- skor tampil besar dan elegan

Hindari:

- font playful
- font techno
- font terlalu futuristik

==================================================
LAYOUT
==================================================

Desktop:

- dashboard modern
- sidebar elegan
- top navbar minimal

Mobile:

- single column
- nyaman disentuh
- tidak padat
- responsive sempurna

Gunakan:

- spacing luas
- layout stabil
- card fleksibel

==================================================
MOBILE EXPERIENCE
==================================================

Pastikan:

- tombol cukup besar
- upload area jelas
- hasil mudah dibaca
- gunakan accordion untuk feedback panjang
- skor langsung terlihat
- tidak ada overflow layout

==================================================
ACADEMIC LOOK
==================================================

Tampilan HARUS terasa seperti:

- sistem evaluasi akademik
- dashboard penelitian
- assessment platform profesional

Gunakan label:

- Structure
- Argumentation
- Coherence
- Grammar
- Relevance

Hindari:

- chatbot bubble
- AI neon style
- ilustrasi robot
- efek AI berlebihan

==================================================
OUTPUT PRESENTATION
==================================================

Tampilkan:

- skor utama besar
- grade badge
- summary section
- strengths card
- weaknesses card
- suggestions card
- radar chart atau progress chart
- detailed feedback section

Tampilan hasil harus terasa seperti:
“Academic Evaluation Report”

==================================================
ANIMATION
==================================================

Gunakan animasi:

- fade ringan
- smooth transition
- skeleton loading
- subtle hover

Hindari:

- animasi berlebihan
- flashy transition
- efek gaming

==================================================
FRONTEND VALIDATION
==================================================

Gunakan:

- React Hook Form
- Zod schema validation

Handle:

- invalid file
- backend offline
- timeout
- auth error
- upload error

==================================================
API ENDPOINTS
==================================================

Buat endpoint:

AUTH:

- POST /auth/register
- POST /auth/login
- GET /auth/me

ESSAYS:

- POST /essays/evaluate
- GET /essays/history
- GET /essays/{id}
- DELETE /essays/{id}

SYSTEM:

- GET /health

==================================================
OUTPUT YANG SAYA MAU DARI KAMU
==================================================

Berikan:

1. seluruh struktur folder backend
2. seluruh struktur folder frontend
3. seluruh kode backend lengkap
4. seluruh kode frontend lengkap
5. seluruh schema pydantic
6. seluruh model SQLAlchemy
7. seluruh endpoint FastAPI
8. implementasi JWT
9. konfigurasi PostgreSQL
10. konfigurasi Alembic
11. Groq service implementation
12. prompt evaluator final
13. requirements.txt
14. package.json
15. contoh .env
16. migration database
17. cara menjalankan backend
18. cara menjalankan frontend
19. cara testing API
20. contoh response API
21. production-ready basic implementation

==================================================
PENTING
==================================================

- Jangan memberi pseudo-code
- Berikan kode nyata
- Pastikan semua sinkron
- Pastikan frontend benar-benar connect ke backend
- Pastikan schema konsisten
- Fokus pada maintainability
- Fokus pada clean architecture
- Fokus pada kestabilan sistem
- Fokus pada UI premium akademis
- Pastikan hasil akhir terasa profesional
- Pastikan project bisa langsung dijalankan
