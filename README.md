# Calculadora BMC — Guía completa

Esta guía contiene los pasos para dejar la app funcionando desde internet, generar el APK y controlar el panel de administrador.

Resumen rápido:
- Backend: `bmc-backend` (Node + Express + MongoDB)
- Frontend: `bmc-frontend` (Expo / React Native)

---

## 1) Preparar backend local

```bash
cd bmc-backend
npm install
# configura .env
# MONGO_URI=<tu_uri_mongo>
# PORT=3000
# ADMIN_EMAIL=admin@admin.com
# ADMIN_PASSWORD=bmcAdmin123
npm start
```

El servidor arrancará en `http://localhost:3000`.

---

## 2) Exponer backend a internet (prueba rápida)

### Opción A — Localtunnel (rápido, sin cuenta)

```bash
npx localtunnel --port 3000
# copiar la URL pública que entrega, ejemplo: https://abcd.loca.lt
```

### Opción B — ngrok (recomendado para pruebas avanzadas)

- Crear cuenta en https://dashboard.ngrok.com/signup
- Instalar tu authtoken:

```bash
npx ngrok authtoken <TU_AUTHTOKEN>
npx ngrok http 3000
```

> Ambas opciones crean una URL pública temporal que redirige al servidor local.

Cambia `bmc-frontend/src/config.js` para usar la URL pública:

```js
export const API_URL = 'https://mi-url-publica/api';
```

---

## 3) Preparar frontend y EAS (para generar APK)

Instala dependencias y `eas-cli`:

```bash
cd bmc-frontend
npm install
npm install -g eas-cli
npx eas login   # conecta con tu cuenta Expo (interactivo)
```

He añadido `eas.json` y el script `eas:build` en `package.json`.

Para construir el APK (tras login):

```bash
npx eas build -p android --profile production
```

> Nota: EAS requiere que inicies sesión con tu cuenta Expo. No puedo ejecutar la parte que requiere tus credenciales por ti.

---

## 4) Archivos añadidos para facilitar despliegue

He creado los siguientes archivos útiles:

- `bmc-backend/Dockerfile` — para desplegar en servicios que acepten contenedores.
- `bmc-backend/Procfile` — para plataformas tipo Heroku/Render.
- `bmc-backend/package.json` ahora incluye `start:prod`.
- `bmc-frontend/eas.json` y script `eas:build` en `bmc-frontend/package.json`.

Usa el Dockerfile si prefieres desplegar con Docker:

```bash
docker build -t calculadora-bmc-backend ./bmc-backend
docker run -e MONGO_URI="<tu_mongo>" -e ADMIN_EMAIL="admin@admin.com" -e ADMIN_PASSWORD="bmcAdmin123" -p 3000:3000 calculadora-bmc-backend
```

---

## 5) Despliegue recomendado (Render / Railway) — pasos rápidos

### Render

1. Crea una cuenta en https://render.com
2. New -> Web Service -> Connect Repo (sube tu repo a GitHub o sube como ZIP)
3. En Build Command pon `npm install` (o `npm install && npm run build` si tuvieras paso de build)
4. Start Command: `npm run start:prod`
5. Añade las variables de entorno: `MONGO_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `PORT`

### Railway

1. Crea cuenta en https://railway.app
2. New Project -> Deploy from GitHub
3. Configura las Environment Variables como en Render

Después del deploy obtendrás una URL pública (ej: `https://mi-backend.onrender.com`).
Usa esa URL en `bmc-frontend/src/config.js`:

```js
export const API_URL = 'https://mi-backend.onrender.com/api';
```

---

## 6) Generar APK y distribuir

1. Actualiza `bmc-frontend/src/config.js` con la URL pública del backend.
2. En `bmc-frontend`, asegúrate de haber hecho `npx eas login`.
3. Ejecuta la build:

```bash
npx eas build -p android --profile production
```

4. Cuando termine, descarga el `.apk` desde la consola de EAS o desde la URL que te provea Expo.
5. Envía el `.apk` a quien quieras (WhatsApp, correo, Telegram). La app enviará operaciones al backend público.

---

## 7) Acceder como administrador (desde PC o móvil)

- Inicia sesión en la app con:
  - Correo: `admin@admin.com`
  - Contraseña: `bmcAdmin123`
- Si tu cuenta tiene rol `admin`, verás el botón `Panel Admin` en la calculadora y podrás ver los historiales de los usuarios.

Puedes ejecutar la app en web (para ver en PC) con:

```bash
cd bmc-frontend
npm start
# abrir la opción Web en Expo o la URL local que muestre la terminal
```

---

## 8) Qué puedo hacer ahora (elige una opción)

A) Intento ejecutar la build EAS aquí (necesitarás ejecutar `npx eas login` en tu terminal y completar el login interactivo). Yo puedo continuar el comando en esta máquina después de que inicies sesión.

B) Te guío paso a paso para desplegar en Render y dejo todo listo; tú solo conectas con tu cuenta y pulsas deploy.

C) Te preparo un ZIP con el backend listo para subir a GitHub/Render y con instrucciones exactas para que tú subas y despliegues.

Dime A, B o C y procedo.
