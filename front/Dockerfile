# Usar uma imagem base do Node.js
FROM node:18

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar os arquivos do projeto para o diretório de trabalho no container
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install

# Copiar o resto dos arquivos do projeto
COPY . .

# Compilar a aplicação para produção
RUN npm run build

# Expor a porta que o servidor vai rodar
EXPOSE 8080

# Comando para iniciar o servidor de produção
CMD ["npm", "run", "dev"]

