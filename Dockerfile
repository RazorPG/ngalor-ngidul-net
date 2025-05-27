# gunakan image node.js
FROM node:18-alpine

# direktori kerja
WORKDIR /app

# salin semua file
COPY . .

# install dependencies
RUN npm install

# jalankan aplikasi
CMD ["npm", "start"]

# Expose port
EXPOSE 3000