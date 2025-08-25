# WhatsApp Ticket Backend (MySQL)

- Node.js + TypeScript
- Express + Socket.IO
- TypeORM (MySQL) – requires `mysql2` driver.
- Baileys for WhatsApp session.

## Quick start
1. Copy `.env.example` to `.env` and fill in values (MySQL, JWT, etc.)
2. Ensure a MySQL 8.x server is reachable (`DB_NAME` pre-created) and credentials are valid.
3. `npm i`
4. `npm run dev`
5. Call `POST /api/whatsapp/start` (admin token required) and scan QR from server logs.

## Security
- JWT in `Authorization: Bearer` header.
- Rate limiting + Helmet.
- Use HTTPS and a reverse proxy (Nginx) in prod.

## Next
- File/media message handling (download to `UPLOAD_DIR`).
- Operator assignment & SLA fields in tickets.
- Audit logs.
- Multi-session support.