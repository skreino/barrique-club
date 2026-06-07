# Barrique Club

CRM e fidelity digitale mobile-first per Caffe Barrique, bar e vineria premium.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Database con RLS
- Vercel-ready

## Installazione

```bash
cd barrique-club
npm install
npm run dev
```

Apri `http://localhost:3000`.

## Variabili ambiente

Crea `.env.local` copiando `.env.example`.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Le trovi in Supabase in `Project Settings > API`.

## Setup Supabase

1. Crea un nuovo progetto Supabase.
2. Vai in `SQL Editor`.
3. Incolla ed esegui tutto il file `supabase/schema.sql`.
4. In `Authentication > URL Configuration`, imposta il dominio locale e poi quello Vercel.
5. Registra il primo utente da `/register`.
6. Promuovi l'utente titolare ad admin.

```sql
update public.profiles
set role = 'admin'
where email = 'titolare@caffebarrique.it';
```

Da quel momento l'utente entra in `/admin`; i clienti normali entrano in `/club`.

## Query utili

Modificare il premio fidelity attivo:

```sql
update public.rewards
set name = 'Calice della casa', required_checkins = 10
where active = true;
```

Creare un tag manualmente:

```sql
insert into public.tags (name)
values ('vip')
on conflict (name) do nothing;
```

## Build

```bash
npm run build
```

## Deploy su Vercel

1. Crea un repository GitHub.
2. Pusha il progetto.
3. Importa il repository in Vercel.
4. Aggiungi le variabili:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy.
6. Aggiungi l'URL Vercel in Supabase `Authentication > URL Configuration`.

## Deploy su GitHub

```bash
git init
git add .
git commit -m "Create Barrique Club CRM"
git branch -M main
git remote add origin https://github.com/USERNAME/barrique-club.git
git push -u origin main
```

## Note MVP

- Il QR cliente contiene un identificativo personale per riconoscimento e check-in manuale da admin.
- La scansione QR automatica non fa parte della v1.
- Non ci sono clienti finti hardcoded nell'app.
- La sicurezza usa Supabase Auth e RLS base: i customer vedono solo i propri dati, gli admin gestiscono il CRM.
