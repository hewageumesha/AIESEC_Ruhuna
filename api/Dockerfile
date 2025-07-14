# Use a Node base image
FROM node:18

WORKDIR /app

COPY ./frontend ./frontend
COPY ./api ./api

# Install frontend
RUN cd frontend && npm install && npm run build

# Install backend
RUN cd ../api && npm install

CMD ["node", "api/index.js"]
