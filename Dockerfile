# ================================
# Etapa 1: Construcción
# ================================
FROM node:18-alpine AS build

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo dev para compilar)
RUN npm install

# Copiar todo el código fuente
COPY . .

# Compilar la aplicación NestJS
RUN npm run build


# ================================
# Etapa 2: Ejecución
# ================================
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos necesarios desde la etapa anterior
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/dist ./dist

# Instalar solo dependencias de producción
RUN npm install --only=production

# Exponer el puerto por defecto de NestJS
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "dist/main.js"]
