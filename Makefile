CWD := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

ifeq ($(OS),Windows_NT)
	REVERSE_SLASHES = $(subst /,\,$1)
	MKDIRP = if not exist $(call REVERSE_SLASHES,$1) (mkdir $(call REVERSE_SLASHES,$1))
	RMRF = if exist $(call REVERSE_SLASHES,$1) (rmdir /s /q $(call REVERSE_SLASHES,$1))
else
	MKDIRP = mkdir -p $1
	RMRF = rm -rf $1
endif

DOCKER_IMG := board-game-storage
ifneq ($(SKIP_DOCKER), true)
	RUN := docker run --rm -e SKIP_DOCKER=true -v $(CWD):/root/workspace $(DOCKER_IMG)
endif

SRCDIR := src/net/smrq/board_game_storage
SCADDIR := scad
STLDIR := stl

GAMES := $(foreach file,$(wildcard $(SRCDIR)/games/*.clj),$(basename $(notdir $(file))))

all: $(GAMES)
.PHONY: all list clean docker format $(GAMES)
.SECONDARY:

list:
	@echo $(GAMES)

clean:
	$(call RMRF,$(SCADDIR))
	$(call RMRF,$(STLDIR))

docker: Dockerfile
	docker build -t $(DOCKER_IMG) .

format:
	$(RUN) lein cljfmt fix

$(GAMES):
	@$(call MKDIRP,$(SCADDIR))
	@$(call MKDIRP,$(STLDIR))
	@echo ** $@ **
	@echo Building SCAD file...
	@$(RUN) lein exec -p $(SRCDIR)/games/$@.clj
	@echo Building STL files...
	@$(RUN) bash -c "for infile in $(SCADDIR)/$@__*.scad; do outfile=$${infile%%.scad}.stl; outfile=$(STLDIR)/$${outfile##$(SCADDIR)/}; openscad -o $$outfile $$infile; done"
