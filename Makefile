DOCKER_COMPOSE = docker compose
SERVICE = commerce-crm

.PHONY: all
all: build up

.PHONY: build
build:
	$(DOCKER_COMPOSE) build

.PHONY: up
up:
	$(DOCKER_COMPOSE) up

.PHONY: update
update:
	$(DOCKER_COMPOSE) up -d

.PHONY: down
down:
	$(DOCKER_COMPOSE) down

.PHONY: logs
logs:
	$(DOCKER_COMPOSE) logs -f $(service)

.PHONY: bash
bash:
	$(DOCKER_COMPOSE) exec $(SERVICE) /bin/sh

.PHONY: clean
clean:
	$(DOCKER_COMPOSE) down -v --remove-orphans

.PHONY: deploy
deploy:
	vercel deploy --prod

.PHONY: migrate
migrate:
	docker-compose run --rm app npx prisma migrate dev

.PHONY: push
push:
	docker-compose run --rm app npx prisma db push

.PHONY: studio
studio:
	docker-compose run --rm -p 5555:5555 app npx prisma studio

.PHONY: lint
lint:
	docker-compose run --rm app npm run lint

.PHONY: lint-fix
lint-fix:
	docker-compose run --rm app npm run lint:fix

.PHONY: format
format:
	docker-compose run --rm app npm run format:write

.PHONY: typecheck
typecheck:
	docker-compose run --rm app npm run typecheck
