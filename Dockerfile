FROM node:20.2.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV ACCESS_TOKEN_SECRET=487306efdcaaae3f46cc037e9daa80b725ea89f5da89a86bf256cd4988e4de5ba85de0b9000908aa8f8c470c2435203a47626c741cc92c371c46f9750f79d14a

ENV REFRESH_TOKEN_SECRET=453d9538bd217968e3ff042cc875688cc89e604285eb41bcddf999d0e5e6920172229aced3e2b50c8d6bcf7c78a7b319d3200d8aff20eb5965dfba960130b9aa

ENV DATABASE_URI=mongodb+srv://ovkhmelik:PMgpL1nfUi21mdQD@cluster0.o46biua.mongodb.net/?retryWrites=true&w=majority

EXPOSE 3000

CMD ["npm", "start"]