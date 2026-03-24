DOCKER_COMPOSE = docker compose
SERVICE = app
PROJECT = crm

.PHONY: all
all: build up

.PHONY: build
build:
	$(DOCKER_COMPOSE) build

.PHONY: up
up:
	$(DOCKER_COMPOSE) -p $(PROJECT) up --build

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

# .PHONY: migrate
# migrate:
# 	docker-compose run --rm app npx prisma migrate dev

# .PHONY: push
# push:
# 	docker-compose run --rm app npx prisma db push

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

# prisma helpers
.PHONY: dpf
dpf:
	$(DOCKER_COMPOSE) -p $(PROJECT) exec $(SERVICE) prisma format

.PHONY: dpg
dpg:
	$(DOCKER_COMPOSE) -p $(PROJECT) exec $(SERVICE) prisma generate

.PHONY: dpm
dpm:
	$(DOCKER_COMPOSE) -p $(PROJECT) exec $(SERVICE) prisma migrate dev
