.PHONY: up down restart logs ps serve help

PORT ?= 8000

help:           ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  %-10s %s\n", $$1, $$2}'

up:             ## Build & start in Docker (http://localhost:$(PORT))
	docker compose up -d --build
	@echo "Serving on http://localhost:$(PORT)"

down:           ## Stop the container
	docker compose down

restart:        ## Restart the container
	docker compose restart

logs:           ## Tail container logs
	docker compose logs -f

ps:             ## Show containers
	docker compose ps

serve:          ## Serve without Docker (python) on $(PORT)
	@echo "Serving on http://localhost:$(PORT)  (Ctrl-C to stop)"
	@python3 -m http.server $(PORT)
