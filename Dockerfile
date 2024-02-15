# Establecer la imagen base
FROM node:18 as build

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos del paquete.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install --omit=dev

# Copiar el resto de los archivos de la aplicación
COPY . .

# Construir la aplicación
RUN npm run build

# Fase 2: Configurar el servidor Nginx
FROM nginx:1.21.1-alpine

# Copiar los archivos estáticos generados en la fase de construcción
COPY --from=build /app/dist/acm-project-webapp /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
