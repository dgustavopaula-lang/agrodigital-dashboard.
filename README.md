AgroDigital - Sistema de Gestao Agricola

GPS.dev - Gustavo Paula Santos

Sistema de gestao agricola com frontend React/TypeScript e backend Node/Express.

Endpoints:
GET /api/fazendas
GET /api/fazendas/:id
POST /api/fazendas
PUT /api/fazendas/:id
DELETE /api/fazendas/:id
GET /api/safras
GET /api/safras/fazenda/:id
POST /api/safras
GET /api/concorrentes
GET /api/concorrentes/:id

Como rodar:
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev

Deploy Render:
Backend: Root=backend, Build=npm install, Start=node server.js
Frontend: Root=frontend, Build=npm run build, Publish=dist/

Stack: React 18, TypeScript, Vite, Node.js v24, Express 4, CORS
Visual: fundo 0f172a, laranja F97316, Remix Icons

Autor: Gustavo Paula Santos - GPS.dev
https://gustavopaulasantos.com.br
