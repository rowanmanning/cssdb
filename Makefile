
# Color helpers
C_CYAN=\x1b[34;01m
C_RESET=\x1b[0m

# Default target
all: deps update-libs build

# Install dependencies
deps:
	@echo "$(C_CYAN)> installing dependencies$(C_RESET)"
	@npm install

# Add a library
add-lib:
	@echo "$(C_CYAN)> Adding library$(C_RESET)"
	@node ./_script/add-library.js ${repo}

# Update libraries
update-libs:
	@echo "$(C_CYAN)> Updating libraries$(C_RESET)"
	@node ./_script/update-libraries.js

# Clean libraries
clean-libs:
	@echo "$(C_CYAN)> Cleaning libraries$(C_RESET)"
	@node ./_script/clean-libraries.js

# Dedupe libraries
dedupe-libs:
	@echo "$(C_CYAN)> Deduping libraries$(C_RESET)"
	@node ./_script/dedupe-libraries.js

# Build the site
build:
	@echo "$(C_CYAN)> Building site$(C_RESET)"
	@jekyll build --drafts

# Serve the site
serve:
	@echo "$(C_CYAN)> Serving site$(C_RESET)"
	@jekyll serve --watch --drafts --host localhost
