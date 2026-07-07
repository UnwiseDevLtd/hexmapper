.PHONY: build up down restart logs ps serve help

PORT ?= 8000
ENGINE ?= $(shell command -v docker >/dev/null 2>&1 && echo docker || echo podman)

help:           ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  %-10s %s\n", $$1, $$2}'

build:          ## Compile src/*.js -> dist/app.js
	node build.js

up:             ## Build & start in Docker/Podman (http://localhost:$(PORT))
	$(ENGINE) compose up -d --build
	@echo "Serving on http://localhost:$(PORT) (engine: $(ENGINE))"

down:           ## Stop the container
	$(ENGINE) compose down

restart:        ## Restart the container
	$(ENGINE) compose restart

logs:           ## Tail container logs
	$(ENGINE) compose logs -f

ps:             ## Show containers
	$(ENGINE) compose ps

serve: build    ## Build then serve without Docker on $(PORT)
	@echo "Serving on http://localhost:$(PORT)  (Ctrl-C to stop)"
	@python3 -m http.server $(PORT)

watch:          ## Rebuild dist/app.js on src/ changes
	node build.js --watch
