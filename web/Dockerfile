# Build stage
FROM node:22.13.1-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist/web/browser /usr/share/nginx/html

# Configure nginx for Angular routing
COPY --from=build /app/dist/web/browser/index.html /usr/share/nginx/html/index.html

RUN echo $'\n\
    server {\n\
    listen 80;\n\
    server_name localhost;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    \n\
    location / {\n\
    try_files $uri $uri/ /index.html;\n\
    }\n\
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
