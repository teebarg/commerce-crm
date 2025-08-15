dev:
	docker-compose up --build

build:
	docker-compose build

start:
	docker-compose up -d

stop:
	docker-compose down

restart:
	docker-compose down && docker-compose up -d

db-migrate:
	docker-compose run --rm app npx prisma migrate dev

db-push:
	docker-compose run --rm app npx prisma db push

db-studio:
	docker-compose run --rm -p 5555:5555 app npx prisma studio

lint:
	docker-compose run --rm app npm run lint

lint-fix:
	docker-compose run --rm app npm run lint:fix

format:
	docker-compose run --rm app npm run format:write

typecheck:
	docker-compose run --rm app npm run typecheck
