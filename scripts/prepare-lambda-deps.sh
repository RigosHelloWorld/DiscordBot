#!/bin/bash
set -e

# We install into lambda/deps using manylinux wheels so that any native extensions
# (e.g. Ed25519 verification) are compiled for Amazon Linux and will load correctly
# in AWS Lambda—without needing Docker or a local Linux build environment.

python3.10 -m pip install \
  --platform manylinux2014_x86_64 \
  --implementation cp \
  --abi cp310 \
  --only-binary=:all: \
  --target lambda/deps \
  -r lambda/handlers/requirements.txt
