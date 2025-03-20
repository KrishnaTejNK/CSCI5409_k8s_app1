FROM node:18
WORKDIR /app
COPY . /app
RUN npm install express axios
CMD ["node", "index.js"]
EXPOSE 6000