FROM node:18-alpine

# Establece la carpeta de trabajo
WORKDIR /usr/src/app

# Copia sólo package.json para aprovechar cache de capas
COPY bmc-backend/package*.json ./

# Instala dependencias de producción
RUN npm install --legacy-peer-deps --production

# Copia el resto del backend
COPY bmc-backend/ .

EXPOSE 3000

CMD ["node", "server.js"]
