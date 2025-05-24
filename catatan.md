# Panduan Deployment Aplikasi ke Google Cloud Platform

Dokumen ini menjelaskan langkah-langkah untuk mendeploy backend (Node.js/Express) ke Google Cloud Run dan frontend (React/Vite) ke Google App Engine.

## Daftar Isi
1.  [Prasyarat Umum Google Cloud](#prasyarat-umum-google-cloud)
2.  [Deployment Backend ke Google Cloud Run](#deployment-backend-ke-google-cloud-run)
    *   [Langkah 1: Persiapan Kode Backend](#langkah-1-persiapan-kode-backend)
    *   [Langkah 2: Membuat Dockerfile](#langkah-2-membuat-dockerfile)
    *   [Langkah 3: Membuat file `.dockerignore`](#langkah-3-membuat-file-dockerignore)
    *   [Langkah 4: (Opsional) Konfigurasi Cloud Build](#langkah-4-opsional-konfigurasi-cloud-build)
    *   [Langkah 5: Build dan Push Docker Image](#langkah-5-build-dan-push-docker-image)
    *   [Langkah 6: Deploy ke Cloud Run](#langkah-6-deploy-ke-cloud-run)
    *   [Langkah 7: Konfigurasi Environment Variables & Secrets](#langkah-7-konfigurasi-environment-variables--secrets)
    *   [Langkah 8: Menghubungkan ke Cloud SQL (jika menggunakan)](#langkah-8-menghubungkan-ke-cloud-sql-jika-menggunakan)
    *   [Langkah 9: Penanganan File Upload](#langkah-9-penanganan-file-upload)
3.  [Deployment Frontend ke Google App Engine](#deployment-frontend-ke-google-app-engine)
    *   [Langkah 1: Persiapan Kode Frontend](#langkah-1-persiapan-kode-frontend)
    *   [Langkah 2: Membuat file `app.yaml`](#langkah-2-membuat-file-appyaml)
    *   [Langkah 3: (Opsional) Konfigurasi Cloud Build untuk Frontend](#langkah-3-opsional-konfigurasi-cloud-build-untuk-frontend)
    *   [Langkah 4: Build Aplikasi Frontend](#langkah-4-build-aplikasi-frontend)
    *   [Langkah 5: Deploy ke App Engine](#langkah-5-deploy-ke-app-engine)
    *   [Langkah 6: Konfigurasi Environment Variables Frontend](#langkah-6-konfigurasi-environment-variables-frontend)
4.  [Konfigurasi DNS dan Custom Domain](#konfigurasi-dns-dan-custom-domain)
5.  [Monitoring dan Logging](#monitoring-dan-logging)

---

## 1. Prasyarat Umum Google Cloud

Sebelum memulai, pastikan Anda telah melakukan hal berikut:

1.  **Membuat Akun Google Cloud Platform (GCP):** Jika belum punya, daftar di [cloud.google.com](https://cloud.google.com/).
2.  **Membuat Proyek GCP:** Buat proyek baru atau gunakan proyek yang sudah ada di [Google Cloud Console](https://console.cloud.google.com/).
3.  **Menginstal Google Cloud SDK (gcloud CLI):** Ikuti panduan instalasi di [dokumentasi resmi](https://cloud.google.com/sdk/docs/install).
4.  **Login ke gcloud:** Jalankan `gcloud auth login` dan `gcloud auth application-default login`.
5.  **Set Proyek Default:** Jalankan `gcloud config set project YOUR_PROJECT_ID`. Ganti `YOUR_PROJECT_ID` dengan ID proyek Anda.
6.  **Mengaktifkan API yang Diperlukan:**
    *   Cloud Run API
    *   Artifact Registry API (atau Container Registry API, meskipun Artifact Registry lebih direkomendasikan)
    *   Cloud Build API (jika menggunakan Cloud Build)
    *   App Engine Admin API
    *   Cloud SQL Admin API (jika menggunakan Cloud SQL)
    *   Secret Manager API (untuk manajemen secrets)
    *   Cloud Storage API (untuk file uploads)

    Anda dapat mengaktifkan API melalui Cloud Console (bagian "APIs & Services" > "Library") atau menggunakan gcloud:
    ```bash
    gcloud services enable run.googleapis.com
    gcloud services enable artifactregistry.googleapis.com
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable appengine.googleapis.com # Untuk App Engine
    gcloud services enable sqladmin.googleapis.com
    gcloud services enable secretmanager.googleapis.com
    gcloud services enable storage.googleapis.com
    ```

---

## 2. Deployment Backend ke Google Cloud Run

Backend Node.js/Express akan di-containerize menggunakan Docker dan dideploy ke Cloud Run.

### Langkah 1: Persiapan Kode Backend

*   Pastikan backend Anda mendengarkan port yang ditentukan oleh environment variable `PORT` (Cloud Run menyediakannya secara default, biasanya `8080`).
    ```javascript
    // Di file index.js atau file utama server Anda
    const port = process.env.PORT || 3000; // Cloud Run akan set process.env.PORT
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
    ```
*   Pastikan `package.json` memiliki skrip `start` yang valid untuk menjalankan aplikasi Anda dalam mode produksi.
    ```json
    // package.json
    "scripts": {
      "start": "node index.js", // Sesuaikan dengan file entry point Anda
      // ...skrip lainnya
    }
    ```
*   **Penting untuk ES Modules (`__dirname`, `__filename`):** Jika Anda menggunakan ES Modules (`"type": "module"` di `package.json`), pastikan path resolution seperti `__dirname` ditangani dengan benar. Contoh di `UserController.js` sudah baik.

### Langkah 2: Membuat Dockerfile

Buat file bernama `Dockerfile` (tanpa ekstensi) di root direktori `backend/`.

```dockerfile
# Gunakan base image Node.js yang sesuai
FROM node:18-slim

# Set direktori kerja di dalam container
WORKDIR /usr/src/app

# Copy package.json dan pnpm-lock.yaml (atau package-lock.json jika menggunakan npm)
COPY package.json pnpm-lock.yaml ./

# Install pnpm (jika belum ada di base image dan Anda menggunakan pnpm)
# RUN npm install -g pnpm

# Install dependencies menggunakan pnpm
RUN corepack enable && pnpm install --frozen-lockfile --prod
# Jika menggunakan npm:
# RUN npm ci --only=production
# Jika menggunakan yarn:
# RUN yarn install --frozen-lockfile --production

# Copy sisa kode aplikasi
COPY . .

# Pastikan direktori uploads/profiles dan uploads/products ada dan writable jika diperlukan saat runtime
# Namun, untuk Cloud Run yang stateless, file upload sebaiknya ke Cloud Storage (lihat Langkah 9)
# RUN mkdir -p uploads/profiles uploads/products && chmod -R 777 uploads

# Expose port yang akan digunakan aplikasi (sesuai dengan yang didengarkan aplikasi)
# Cloud Run akan mengabaikan EXPOSE ini dan menggunakan PORT env var
# EXPOSE 3000

# Perintah untuk menjalankan aplikasi ketika container dimulai
CMD [ "pnpm", "start" ]
# Jika menggunakan npm:
# CMD [ "npm", "start" ]
# Jika menggunakan yarn:
# CMD [ "yarn", "start" ]
```

### Langkah 3: Membuat file `.dockerignore`

Buat file bernama `.dockerignore` di root direktori `backend/` untuk mengecualikan file dan folder yang tidak perlu dari Docker image.

```
node_modules
npm-debug.log
Dockerfile
.dockerignore
.git
.gitignore
README.md
# Tambahkan file atau folder lain yang tidak diperlukan di image produksi
```

### Langkah 4: (Opsional) Konfigurasi Cloud Build

Anda dapat mengotomatiskan proses build Docker image menggunakan Cloud Build. Buat file `cloudbuild.yaml` (atau gunakan nama lain) di root direktori `backend/`.

Contoh `cloudbuild.backend.yaml` (sesuaikan dengan nama file yang Anda gunakan):
```yaml
steps:
- name: 'gcr.io/cloud-builders/docker'
  args:
  - 'build'
  - '-t'
  - '$_GCR_HOSTNAME/$PROJECT_ID/$_SERVICE_NAME:$COMMIT_SHA' # Menggunakan Artifact Registry
  - '.'
  - '-f'
  - 'Dockerfile' # Pastikan path ke Dockerfile benar
  dir: 'backend' # Tentukan direktori konteks build jika cloudbuild.yaml ada di root project
images:
- '$_GCR_HOSTNAME/$PROJECT_ID/$_SERVICE_NAME:$COMMIT_SHA'
substitutions:
  _GCR_HOSTNAME: 'asia-southeast2-docker.pkg.dev' # Ganti dengan region Artifact Registry Anda
  _SERVICE_NAME: 'nama-service-backend-anda' # Ganti dengan nama service Anda
# Anda bisa menambahkan langkah untuk push ke Artifact Registry di sini atau melakukannya secara manual/terpisah
#
# Untuk push otomatis setelah build:
# - name: 'gcr.io/cloud-builders/docker'
#   args: ['push', '$_GCR_HOSTNAME/$PROJECT_ID/$_SERVICE_NAME:$COMMIT_SHA']
```
*   Pastikan `dir: 'backend'` jika file `cloudbuild.backend.yaml` ada di root workspace, bukan di dalam folder `backend`. Jika file ini ada di dalam `backend/`, maka `dir` tidak perlu atau bisa `.`

### Langkah 5: Build dan Push Docker Image

**Opsi A: Build Lokal dan Push Manual**

1.  **Login ke Artifact Registry (atau Container Registry):**
    ```bash
    gcloud auth configure-docker YOUR_REGION-docker.pkg.dev
    # Contoh: gcloud auth configure-docker asia-southeast2-docker.pkg.dev
    ```
2.  **Build Docker Image:**
    Dari direktori `backend/`:
    ```bash
    docker build -t YOUR_REGION-docker.pkg.dev/YOUR_PROJECT_ID/YOUR_REPO_NAME/YOUR_IMAGE_NAME:latest .
    # Contoh:
    # docker build -t asia-southeast2-docker.pkg.dev/projecttcc-afif/backend-repo/givetzy-backend:v1 .
    ```
    *   `YOUR_REGION`: Region Artifact Registry (e.g., `asia-southeast2`).
    *   `YOUR_PROJECT_ID`: ID Proyek GCP Anda.
    *   `YOUR_REPO_NAME`: Nama repository yang Anda buat di Artifact Registry.
    *   `YOUR_IMAGE_NAME`: Nama image Anda.
3.  **Push Docker Image:**
    ```bash
    docker push YOUR_REGION-docker.pkg.dev/YOUR_PROJECT_ID/YOUR_REPO_NAME/YOUR_IMAGE_NAME:latest
    # Contoh:
    # docker push asia-southeast2-docker.pkg.dev/projecttcc-afif/backend-repo/givetzy-backend:v1
    ```

**Opsi B: Menggunakan Cloud Build**

1.  Pastikan Anda sudah membuat repository di Artifact Registry.
    Misalnya, repository bernama `backend-services` di region `asia-southeast2`.
2.  Jalankan Cloud Build dari root direktori workspace Anda (jika `cloudbuild.backend.yaml` ada di sana):
    ```bash
    gcloud builds submit --config backend/cloudbuild.backend.yaml \
      --substitutions=_GCR_HOSTNAME=asia-southeast2-docker.pkg.dev,_SERVICE_NAME=givetzy-backend .
    # Atau jika cloudbuild.yaml ada di dalam backend/ dan Anda berada di root workspace:
    # gcloud builds submit backend --config backend/cloudbuild.backend.yaml \
    #   --substitutions=_GCR_HOSTNAME=asia-southeast2-docker.pkg.dev,_SERVICE_NAME=givetzy-backend
    # Atau jika Anda berada di dalam direktori backend/:
    # gcloud builds submit --config cloudbuild.yaml \
    #   --substitutions=_GCR_HOSTNAME=asia-southeast2-docker.pkg.dev,_SERVICE_NAME=givetzy-backend .
    ```
    *   Ganti `_SERVICE_NAME` dengan nama yang sesuai untuk image Anda.
    *   Cloud Build akan otomatis mem-push image ke Artifact Registry jika dikonfigurasi di `cloudbuild.yaml` atau jika Anda menambahkan langkah push.

### Langkah 6: Deploy ke Cloud Run

Gunakan perintah `gcloud run deploy`.

```bash
gcloud run deploy givetzy-backend-service \
  --image YOUR_REGION-docker.pkg.dev/YOUR_PROJECT_ID/YOUR_REPO_NAME/YOUR_IMAGE_NAME:latest \
  --platform managed \
  --region YOUR_CLOUD_RUN_REGION \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars NODE_ENV=production \
  --max-instances 2 # Sesuaikan sesuai kebutuhan
# Contoh:
# gcloud run deploy givetzy-backend \
#   --image asia-southeast2-docker.pkg.dev/projecttcc-afif/backend-repo/givetzy-backend:v1 \
#   --platform managed \
#   --region asia-southeast2 \
#   --allow-unauthenticated \
#   --port 8080 \
#   --set-env-vars NODE_ENV=production,DB_HOST=your_db_host,DB_USER=your_db_user # Tambahkan env vars lain
```

*   `givetzy-backend-service`: Nama service Cloud Run Anda.
*   `--image`: Path lengkap ke image Anda di Artifact Registry.
*   `--platform managed`: Menggunakan infrastruktur serverless yang dikelola Google.
*   `--region`: Region tempat Cloud Run service akan dideploy (e.g., `asia-southeast2`, `us-central1`).
*   `--allow-unauthenticated`: Memungkinkan akses publik ke service. Hapus jika Anda ingin mengontrol akses melalui IAM.
*   `--port 8080`: Cloud Run akan mengarahkan traffic ke port ini di container Anda. Pastikan aplikasi Anda mendengarkan di port yang diset oleh `process.env.PORT` (yang akan diset ke 8080 oleh Cloud Run jika Anda menentukan `--port 8080` di sini, atau port lain jika Anda menentukannya).
*   `--set-env-vars`: Untuk mengatur environment variables (lihat Langkah 7).
*   `--max-instances`: Batas maksimum instance yang dapat di-scale-out.

Setelah deployment berhasil, Anda akan mendapatkan URL untuk mengakses backend Anda.

### Langkah 7: Konfigurasi Environment Variables & Secrets

Sangat penting untuk tidak hardcode konfigurasi sensitif seperti kredensial database atau API keys di dalam kode atau Docker image.

**Opsi A: Menggunakan `--set-env-vars` saat deploy (kurang aman untuk secrets)**

Seperti contoh di atas, Anda bisa menggunakan `--set-env-vars KEY1=VALUE1,KEY2=VALUE2`.

**Opsi B: Menggunakan Google Secret Manager (Direkomendasikan untuk Secrets)**

1.  **Simpan secret di Secret Manager:**
    Melalui Cloud Console atau gcloud:
    ```bash
    echo -n "your_database_password" | gcloud secrets create DB_PASSWORD --data-file=- --replication-policy=automatic
    gcloud secrets create DB_USER --data-file=<(echo -n "your_db_user") --replication-policy=automatic
    # Ulangi untuk semua secret
    ```
2.  **Berikan Akses ke Cloud Run Service Account:**
    Setiap Cloud Run service memiliki service account. Anda perlu memberikan izin kepada service account ini untuk mengakses secrets.
    *   Temukan service account Cloud Run Anda (biasanya `PROJECT_NUMBER-compute@developer.gserviceaccount.com` atau service account kustom jika Anda membuatnya).
    *   Berikan peran "Secret Manager Secret Accessor" ke service account tersebut untuk secret yang relevan:
        ```bash
        gcloud secrets add-iam-policy-binding YOUR_SECRET_NAME \
          --member="serviceAccount:YOUR_CLOUD_RUN_SERVICE_ACCOUNT_EMAIL" \
          --role="roles/secretmanager.secretAccessor"
        ```
3.  **Mount Secret sebagai Environment Variable di Cloud Run:**
    Saat deploy atau update service:
    ```bash
    gcloud run deploy givetzy-backend-service \
      --image YOUR_IMAGE_PATH \
      --update-secrets /secrets/DB_PASSWORD=DB_PASSWORD:latest,DB_USER=DB_USER:latest \
      # ...opsi lainnya
    ```
    Ini akan membuat file `/secrets/DB_PASSWORD` dan `/secrets/DB_USER` di dalam container.
    Atau, Anda bisa mount secret langsung sebagai environment variable (fitur lebih baru):
    ```bash
    gcloud run deploy givetzy-backend-service \
      --image YOUR_IMAGE_PATH \
      --set-secrets DB_PASSWORD=DB_PASSWORD:latest,DB_USER=DB_USER:latest \
      # ...opsi lainnya
    ```
    Ini akan membuat environment variable `DB_PASSWORD` dan `DB_USER` di container dengan nilai dari secret versi terbaru.

4.  **Akses Secret di Aplikasi Node.js:**
    Jika dimount sebagai file:
    ```javascript
    const fs = require('fs');
    const dbPassword = fs.readFileSync('/secrets/DB_PASSWORD', 'utf8').trim();
    ```
    Jika dimount sebagai environment variable, akses seperti biasa: `process.env.DB_PASSWORD`.

**Environment Variables yang Umum:**
*   `NODE_ENV=production`
*   `PORT` (disediakan Cloud Run, biasanya 8080)
*   `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
*   `JWT_SECRET`
*   API keys lainnya

### Langkah 8: Menghubungkan ke Cloud SQL (jika menggunakan)

Jika database Anda adalah Cloud SQL (MySQL, PostgreSQL, SQL Server):

1.  **Pastikan Cloud SQL instance Anda berjalan dan dapat diakses.**
2.  **Cara Koneksi:**
    *   **Public IP:** Anda bisa mengkonfigurasi Cloud SQL instance dengan Public IP dan menambahkan alamat IP keluar Cloud Run ke daftar authorized networks di Cloud SQL. Ini kurang aman.
    *   **Cloud SQL Connection Name (Direkomendasikan):** Ini adalah cara paling aman dan mudah. Cloud Run memiliki integrasi bawaan dengan Cloud SQL.
        *   Temukan "Connection name" instance Cloud SQL Anda di Cloud Console (format: `PROJECT_ID:REGION:INSTANCE_ID`).
        *   Saat deploy Cloud Run, tambahkan parameter `--add-cloudsql-instances` atau `--set-cloudsql-instances`:
            ```bash
            gcloud run deploy givetzy-backend-service \
              --image YOUR_IMAGE_PATH \
              --add-cloudsql-instances YOUR_PROJECT_ID:YOUR_REGION:YOUR_INSTANCE_ID \
              # ...opsi lainnya
            ```
        *   Di kode aplikasi Anda, gunakan Unix socket untuk koneksi. Library database Node.js biasanya mendukung ini. Untuk `mysql2`:
            ```javascript
            // config/Database.js
            import mysql from 'mysql2/promise';
            import dotenv from 'dotenv';
            dotenv.config();

            const dbConfig = {
              user: process.env.DB_USER,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
            };

            if (process.env.NODE_ENV === 'production' && process.env.INSTANCE_CONNECTION_NAME) {
              // Untuk Cloud Run dengan Cloud SQL Connection Name
              dbConfig.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
            } else {
              // Untuk development lokal atau koneksi TCP lainnya
              dbConfig.host = process.env.DB_HOST;
              // dbConfig.port = process.env.DB_PORT || 3306; // Jika port non-default
            }

            const pool = mysql.createPool(dbConfig);

            export default pool;
            ```
            Anda perlu set `INSTANCE_CONNECTION_NAME` sebagai environment variable di Cloud Run, nilainya adalah connection name Cloud SQL Anda.

### Langkah 9: Penanganan File Upload

Cloud Run instances bersifat stateless dan filesystem-nya sementara. File yang diupload langsung ke instance akan hilang saat instance dihentikan atau diganti.

**Solusi: Gunakan Google Cloud Storage (GCS)**

1.  **Buat GCS Bucket:**
    ```bash
    gsutil mb -p YOUR_PROJECT_ID -l YOUR_REGION gs://your-unique-bucket-name
    # Contoh: gsutil mb -p projecttcc-afif -l ASIA-SOUTHEAST2 gs://givetzy-uploads
    ```
2.  **Set Izin Bucket:**
    *   Buat bucket publik jika file dimaksudkan untuk diakses publik.
    *   Atau, atur ACLs/IAM permissions agar service account Cloud Run Anda memiliki izin tulis (`roles/storage.objectCreator` atau `roles/storage.objectAdmin`) ke bucket tersebut.
3.  **Update Kode Backend:**
    Gunakan library `@google-cloud/storage` untuk mengupload file ke GCS.
    ```javascript
    // Contoh di UserController.js atau middleware upload
    import { Storage } from '@google-cloud/storage';
    const storage = new Storage(); // Otomatis menggunakan kredensial service account di Cloud Run
    const bucketName = 'your-unique-bucket-name'; // atau dari env var

    // ... di dalam fungsi upload ...
    // const blob = storage.bucket(bucketName).file(destinationPath); // destinationPath = 'profiles/filename.jpg'
    // const blobStream = blob.createWriteStream({ resumable: false });
    // file.stream.pipe(blobStream)
    //   .on('finish', () => {
    //     const publicUrl = `https://storage.googleapis.com/${bucketName}/${destinationPath}`;
    //     // Simpan publicUrl ke database
    //   })
    //   .on('error', (err) => { /* handle error */ });
    ```
    *   Pastikan service account Cloud Run memiliki izin yang sesuai untuk menulis ke bucket.
    *   Simpan URL publik file (atau path GCS jika Anda ingin menyajikan file melalui backend) di database Anda, bukan path lokal.

---

## 3. Deployment Frontend ke Google App Engine

Frontend React/Vite akan dideploy sebagai aplikasi statis ke App Engine Standard Environment.

### Langkah 1: Persiapan Kode Frontend

*   Pastikan `package.json` di direktori `Frontend/` memiliki skrip `build` yang menghasilkan file statis di direktori `dist/` (default untuk Vite).
    ```json
    // Frontend/package.json
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
      "preview": "vite preview"
    }
    ```
*   **Konfigurasi Base URL API:**
    Pastikan frontend Anda mengarah ke URL backend Cloud Run yang sudah dideploy. Gunakan environment variable untuk ini.
    Di file `.env.production` atau set saat build:
    `VITE_API_BASE_URL=https://your-cloud-run-backend-url.a.run.app`

### Langkah 2: Membuat file `app.yaml`

Buat file `app.yaml` di root direktori `Frontend/`. Ini adalah file konfigurasi untuk App Engine.

```yaml
# Frontend/app.yaml
runtime: nodejs18 # Atau runtime yang sesuai jika Anda memerlukan build step di App Engine
                  # Untuk SPA murni, runtime tidak terlalu kritikal, bisa juga 'static' jika tidak ada build step.
                  # Namun, menggunakan nodejs runtime memungkinkan penggunaan build script dari package.json.

# Jika Anda ingin App Engine menjalankan build step (misalnya, pnpm run build):
# env: standard
# instance_class: F1 # Kelas instance dasar, cukup untuk build & serving statis

# build_env_variables:
#   NODE_ENV: 'production'
#   # Jika VITE_API_BASE_URL perlu diset saat build:
#   VITE_API_BASE_URL: 'https://your-cloud-run-backend-url.a.run.app'

# entrypoint: serve # Hanya jika Anda menggunakan server kustom. Untuk SPA statis, tidak perlu.

handlers:
  # Sajikan file statis dari folder 'dist' (output build Vite)
  - url: /assets
    static_dir: dist/assets
    secure: always
    redirect_http_response_code: 301

  - url: /(.*\\.(js|css|png|jpg|jpeg|gif|svg|ico|json|txt|map|webmanifest))$
    static_files: dist/\\1
    upload: dist/.*\\.(js|css|png|jpg|jpeg|gif|svg|ico|json|txt|map|webmanifest)$
    secure: always
    redirect_http_response_code: 301

  # Handler untuk semua rute lainnya, arahkan ke index.html untuk SPA routing
  - url: /.*
    static_files: dist/index.html
    upload: dist/index.html
    secure: always
    redirect_http_response_code: 301

# skip_files:
# - node_modules/
# - src/
# - public/ # Folder public Vite, isinya akan di-copy ke dist saat build
# - .env
# - .env.*
# - .eslintrc.cjs
# - .gitignore
# - vite.config.js
# - README.md
# - pnpm-lock.yaml
# - package.json # Kecuali jika App Engine perlu menjalankan build
```

**Catatan tentang `app.yaml`:**
*   Jika Anda melakukan build secara lokal atau melalui Cloud Build (direkomendasikan), dan hanya mendeploy folder `dist`, `app.yaml` bisa lebih sederhana dan runtime bisa `static` atau tidak dispesifikasikan (App Engine akan mendeteksinya).
*   Jika Anda ingin App Engine melakukan build, Anda perlu menyertakan `package.json`, `pnpm-lock.yaml`, dan source code, lalu App Engine akan menjalankan `pnpm run build` (jika `pnpm` terdeteksi atau Anda menggunakan `runtime: nodejsXX` dan `entrypoint` yang sesuai atau skrip `gcp-build` di `package.json`).
*   Untuk SPA Vite, penting untuk memiliki handler fallback (`url: /.*`) yang mengarah ke `dist/index.html`.

**Rekomendasi: Build Lokal/Cloud Build, Deploy `dist`**
Jika Anda build frontend secara lokal atau menggunakan pipeline CI/CD (seperti Cloud Build) untuk menghasilkan folder `dist`, maka `app.yaml` bisa lebih sederhana dan ditempatkan di dalam folder `dist` atau di root `Frontend` tapi merujuk ke `dist`.

Contoh `app.yaml` jika Anda hanya mendeploy folder `dist/`:
(Tempatkan `app.yaml` ini di root `Frontend/` dan deploy dari sana, atau tempatkan di `dist/` dan deploy dari `dist/`)

```yaml
# Frontend/app.yaml (jika mendeploy dari Frontend/ setelah build lokal)
runtime: static # Atau biarkan App Engine mendeteksi
handlers:
  - url: /
    static_files: dist/index.html
    upload: dist/index.html

  - url: /(.*)
    static_files: dist/\\1
    upload: dist/(.*)
```
Namun, `app.yaml` yang lebih lengkap di atas (yang pertama) lebih fleksibel jika Anda ingin App Engine menangani build.

### Langkah 3: (Opsional) Konfigurasi Cloud Build untuk Frontend

Buat file `cloudbuild.frontend.yaml` di root direktori workspace (atau di `Frontend/`).

Contoh `cloudbuild.frontend.yaml`:
```yaml
steps:
# Install dependencies
- name: 'gcr.io/cloud-builders/pnpm' # Gunakan image pnpm jika tersedia, atau node untuk install pnpm
  dir: 'Frontend' # Jalankan di dalam folder Frontend
  args: ['install', '--frozen-lockfile']
  # Jika menggunakan npm:
  # name: 'gcr.io/cloud-builders/npm'
  # args: ['ci']

# Build aplikasi
- name: 'gcr.io/cloud-builders/pnpm' # atau node
  dir: 'Frontend'
  args: ['run', 'build']
  # env:
  # - 'VITE_API_BASE_URL=https://your-cloud-run-backend-url.a.run.app' # Set env var saat build
  # Jika menggunakan npm:
  # name: 'gcr.io/cloud-builders/npm'
  # args: ['run', 'build']

# Deploy ke App Engine
- name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
  dir: 'Frontend' # Pastikan app.yaml ada di sini atau path-nya benar
  entrypoint: 'gcloud'
  args:
    - 'app'
    - 'deploy'
    - 'app.yaml' # Atau hanya 'app deploy' jika app.yaml adalah default
    - '--project=$PROJECT_ID'
    - '--quiet' # Tidak meminta konfirmasi

# Substitutions bisa ditambahkan jika diperlukan
# substitutions:
#   _API_URL: 'https://your-cloud-run-backend-url.a.run.app'
```
*   Pastikan `dir: 'Frontend'` digunakan dengan benar.
*   Anda mungkin perlu image builder kustom atau langkah tambahan untuk `pnpm` jika `gcr.io/cloud-builders/pnpm` tidak tersedia atau tidak sesuai. Alternatifnya, gunakan `name: 'node:18'` lalu `entrypoint: 'pnpm'` setelah menginstallnya.

### Langkah 4: Build Aplikasi Frontend

Jika tidak menggunakan Cloud Build untuk build step, jalankan build secara lokal dari direktori `Frontend/`:
```bash
cd Frontend
pnpm install # atau npm install
pnpm run build # atau npm run build
# Pastikan VITE_API_BASE_URL sudah diset di .env.production atau sebagai prefix perintah build
# Contoh: VITE_API_BASE_URL=https://your-backend-url.a.run.app pnpm run build
cd ..
```
Ini akan membuat folder `dist/` di dalam `Frontend/`.

### Langkah 5: Deploy ke App Engine

**Opsi A: Deploy dari Direktori Frontend (jika `app.yaml` ada di `Frontend/`)**

1.  Pastikan Anda berada di direktori `Frontend/` atau berikan path ke `app.yaml`.
2.  Pilih region untuk App Engine saat pertama kali deploy (hanya sekali per proyek):
    ```bash
    gcloud app create --region=YOUR_APP_ENGINE_REGION
    # Contoh: gcloud app create --region=asia-southeast2
    ```
3.  Deploy:
    Dari direktori `Frontend/`:
    ```bash
    gcloud app deploy app.yaml --project=YOUR_PROJECT_ID
    # Atau jika app.yaml adalah nama default:
    # gcloud app deploy --project=YOUR_PROJECT_ID
    ```
    Jika Anda berada di root workspace:
    ```bash
    gcloud app deploy Frontend/app.yaml --project=YOUR_PROJECT_ID
    ```

**Opsi B: Menggunakan Cloud Build (seperti di Langkah 3)**

Jalankan Cloud Build dari root direktori workspace:
```bash
gcloud builds submit --config cloudbuild.frontend.yaml .
```

Setelah deployment, App Engine akan memberikan URL untuk mengakses frontend Anda (biasanya `https://YOUR_PROJECT_ID.REGION_ID.r.appspot.com`).

### Langkah 6: Konfigurasi Environment Variables Frontend

Untuk aplikasi frontend statis seperti Vite/React, environment variables biasanya di-bundle saat proses build.

*   **Vite:** Menggunakan file `.env` (e.g., `.env.production`). Variabel harus diawali dengan `VITE_`.
    Contoh `Frontend/.env.production`:
    ```
    VITE_API_BASE_URL=https://your-cloud-run-backend-service-url.a.run.app
    ```
    Pastikan file ini ada sebelum menjalankan `pnpm run build`.
*   Jika Anda menggunakan Cloud Build, Anda bisa menyuntikkan env vars saat build step seperti yang ditunjukkan di contoh `cloudbuild.frontend.yaml`.
*   App Engine tidak secara langsung menyediakan environment variables runtime ke file JavaScript statis. Jika Anda memerlukan konfigurasi dinamis setelah build, Anda mungkin perlu:
    *   Membuat endpoint kecil di backend Anda yang menyajikan konfigurasi.
    *   Menggunakan file konfigurasi JavaScript yang di-generate saat deploy.

Untuk `VITE_API_BASE_URL`, cara terbaik adalah mengaturnya saat build.

---

## 4. Konfigurasi DNS dan Custom Domain

Setelah kedua layanan berjalan, Anda mungkin ingin menggunakan custom domain:

*   **Cloud Run:** Buka layanan Cloud Run Anda di Cloud Console, pergi ke tab "Custom Domains", dan ikuti instruksi untuk memetakan domain. Anda perlu memverifikasi kepemilikan domain dan mengupdate record DNS (A, AAAA, atau CNAME).
*   **App Engine:** Buka App Engine > Settings > Custom Domains di Cloud Console. Ikuti proses serupa untuk menambahkan dan memverifikasi domain Anda.

---

## 5. Monitoring dan Logging

*   **Cloud Logging:** Kedua layanan (Cloud Run dan App Engine) secara otomatis mengirim log ke Cloud Logging. Anda bisa melihat log aplikasi, request, dan error di sana.
*   **Cloud Monitoring:** Sediakan metrik performa, uptime checks, dan alerting untuk layanan Anda.
*   **Cloud Run:** Memiliki tab "Metrics" dan "Logs" langsung di halaman service.
*   **App Engine:** Memiliki dashboard sendiri dengan grafik traffic, error, dan latensi.

---

Ini adalah panduan umum. Detail spesifik mungkin bervariasi tergantung pada konfigurasi proyek Anda. Selalu rujuk ke dokumentasi resmi Google Cloud untuk informasi terbaru dan praktik terbaik.