# Usar una imagen de Node.js 18
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar primero package.json y package-lock.json para aprovechar la caché
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Construir el proyecto (genera /dist)
RUN npm run build

# Exponer el puerto que Render usará
EXPOSE 10000

# Comando de inicio
CMD ["node", "server.js"]
