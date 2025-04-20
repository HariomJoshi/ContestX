# Take care of the below points

- We will we using global error handlers , so make sure to do `next()` instead of returning an error, rest will be taken care of by the global error handlers

- Will be using `postgresql` so no need for `models` folder

- For migrations use command
  ```
  npx prisma migrate dev --name init
  ```
- To AutoGenerate Clients use

  ```
  npx prisma generate
  ```

- To run postgres in Docker locally use command

  ```
  docker run -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres
  ```

- To run
