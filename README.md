# Padel Tracker

Seguimiento de partidos de pádel en vivo: cargás los cuatro jugadores, registrás cada punto (winners, errores forzados y no forzados, "magias") y la app lleva el marcador y arma las estadísticas. Al terminar generás un link para compartir el resultado.

**Producción:** https://www.padeltracker.pro — el tracker se usa sin registrarse en [/tracker](https://www.padeltracker.pro/tracker).

## Qué hace

- **Tracker** — marcador automático con punto de oro, star point o ventaja, tiebreak y sets configurables. Se puede deshacer y editar el marcador.
- **Estadísticas** — por jugador y por equipo, rachas, quiebres y gráfico de momentum.
- **Resultados compartidos** — link corto `/r/<id>` con las estadísticas completas.
- **Historial** — con login de Google se guardan los partidos y se pueden reclamar resultados compartidos por otros.
- **Canchas y torneos** — listado público con alta por formulario y aprobación desde el panel de admin.
- **Blog** — artículos en español e inglés (MDX).
- **Bilingüe** — interfaz en español e inglés.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4, Recharts, next-intl
- Postgres propio (`pg`, sin ORM)
- NextAuth con Google para el login
- Deploy en Vercel (push a `main`)

## Correr en local

```bash
npm ci
npm run db:migrate
npm run dev
```

Variables en `.env.local`:

```
DATABASE_URL=
DATABASE_CA_CERTIFICATE_BASE64=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ADMIN_EMAILS=
```

- **Base de datos:** `DATABASE_URL` apunta al Postgres y `DATABASE_CA_CERTIFICATE_BASE64` es el certificado de la CA del servidor en base64 (sin él la conexión va sin TLS, solo para una base local). El build también la necesita: la home y el listado de canchas se generan con datos de la base.
- **Login:** el cliente OAuth de Google necesita como URL de retorno `<dominio>/api/auth/callback/google`.
- **Admin:** `ADMIN_EMAILS` es la lista, separada por comas, de quienes pueden entrar a `/admin`.

## Estructura

```
app/(tracker)/      Tracker y perfil
app/(platform)/     Landing, blog, canchas y torneos
app/r/              Resultados compartidos
app/admin/          Panel de métricas y aprobación de torneos
app/api/            Login, partidos, torneos, compartir
lib/scoring-engine  Reglas del marcador
lib/*-queries.ts    Consultas a la base (solo servidor)
lib/*-service.ts    Llamadas del navegador a las rutas API
db/migrations/      Esquema de la base (SQL plano), se aplica con npm run db:migrate
content/blog/       Posts (MDX) por idioma
messages/           Textos de la interfaz
```
