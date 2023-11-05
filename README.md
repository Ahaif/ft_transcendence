# ft_transcendence
the final project


# If developping locally leave .env as is and do the following

run the project with:
```bash
$ cd backend
$ npm i
$ docker-compose up -d
$ npx prisma migrate dev --name "Init"
$ npm run start:dev
```

```bash
$ cd frontend
$ npm i
$ npm run dev
```

DO NOT MODIFY docker-compose.prod.yaml
when developping locally use docker-compose up -d with the `docker-compose.yaml`

# For production edit .env (check it and do what the comments says)

after editting .env
run the following:

```bash
docker-compose -f docker-compose.prod.yaml up --build
```
