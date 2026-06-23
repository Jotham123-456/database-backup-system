# Database Backup Automation
📦 Database Backup Automation System

A Node.js-based automated backup system that supports PostgreSQL and MongoDB databases, stores backups in cloud storage (Supabase), and sends email notifications to administrators.

🚀 Features
🗄️ Multi-database support (PostgreSQL + MongoDB Atlas)
☁️ Cloud storage integration (Supabase)
⏰ Automated scheduling using cron
📧 Email notifications (success & failure)
🔁 Retry system for failed uploads
📊 Structured logging system
🧹 Automatic cleanup of local backups
🏗️ System Architecture
Databases (Postgres / MongoDB)
        ↓
Backup Engine (pg_dump / mongodump)
        ↓
Local Backup Files
        ↓
Retry Upload System
        ↓
Supabase Storage (Cloud)
        ↓
Email Notification System
        ↓
Admin Alerts
⚙️ Installation
git clone https://github.com/your-username/db-backup-system.git
cd db-backup-system
npm install
🔐 Environment Variables

Create a .env file:

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_key
SUPABASE_BUCKET=database-backups

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
ADMIN_EMAILS=email1,email2

MONGO_URI=your_mongodb_atlas_uri
📂 Configuration

config.json

{
  "schedule": "0 * * * *",
  "databases": [
    "postgresql://user:pass@localhost:5432/shopdb",
    "mongodb+srv://..."
  ]
}
▶️ Run the Project
node src/index.js
⏰ Scheduling

Uses cron format:

Schedule	Meaning
0 * * * *	Every hour
0 0 * * *	Daily
*/10 * * * *	Every 10 minutes
☁️ Cloud Storage

Backups are stored in Supabase:

database-backups/
 ├── postgresql/
 └── mongodb/
📧 Notifications
Success Email includes:
Database name
Type
Size
Backup location
Duration
Failure Email includes:
Error details
Timestamp
Debug info
🧠 Technologies Used
Node.js
PostgreSQL (pg_dump)
MongoDB (mongodump)
Supabase Storage
Nodemailer
node-cron
⚠️ Security Notes
Do NOT expose .env in GitHub
Rotate MongoDB and Supabase keys if leaked
Use App Passwords for Gmail
📌 Author

Built by Jotham as a DevOps automation project.
