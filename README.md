# Desafio de Backend do Ascan - Instituto Atlântico

  #### Deploy manual do docker:
      docker run -p 8080:15672 -p 5672:5672 -p 25676:25676 rabbitmq:3-management
      docker run -e POSTGRES_PASSWORD=ts -e POSTGRES_USER=ts -e POSTGRES_DB=ts -p5432:5432 -d --name postgres postgrests
  #### OPCIONAL:
      docker run -e PGADMIN_DEFAULT_EMAIL="email" -e PGADMIN_DEFAULT_PASSWORD="pass" -p8080:80 --name pgadmin dpage/pgadmin4
  ### Deploy automatizado:
      sudo docker-compose up / docker-compose up
    
 # Install dependencies:
    npm install
    
    npx prisma generate
    
    npx prisma migrate dev
    
 # Run code:
    npm run dev
 # Run unit tests:
    npm run test
