-include .env
export

.PHONY: build up down restart logs ps serve watch dev standalone release publish help

PORT ?= 8000
ENGINE ?= $(shell command -v docker >/dev/null 2>&1 && echo docker || echo podman)
VERSION ?= $(shell date +%Y%m%d).$(shell git rev-parse --short HEAD)

help:           ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  %-12s %s\n", $$1, $$2}'

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

dev:            ## Dev: watch src + serve with auto-reload on :$(PORT)
	@echo "Dev mode on http://localhost:$(PORT) — edit src/*.js, browser auto-refreshes"
	@node build.js --watch & WATCHPID=$$!; trap "kill $$WATCHPID 2>/dev/null" EXIT; python3 -m http.server $(PORT)

standalone:     ## Build standalone minified single-file HTML (dist/standalone.html)
	node build.js --standalone

release: standalone ## Tag, push, publish release + Codeberg Pages
	@git tag $(VERSION) 2>/dev/null || true
	@git push origin $(VERSION) 2>/dev/null || true
	@node --no-network-family-autoselection scripts/publish.js || echo "(Set CODEBERG_TOKEN in .env to auto-publish release)"
	@echo "Publishing to Codeberg Pages..."
	@BLOB=$$(git hash-object -w dist/standalone.html) && \
	TREE=$$(printf '100644 blob %s\tindex.html\n' $$BLOB | git mktree) && \
	COMMIT=$$(git commit-tree $$TREE -m 'publish $(VERSION)') && \
	git push origin $$COMMIT:refs/heads/pages --force && \
	echo "  Pages: https://UnwiseDev.codeberg.page/hexmapper/"
	@echo "Released $(VERSION)"
