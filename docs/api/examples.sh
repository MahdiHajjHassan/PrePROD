#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."
# Executable lifecycle reads ignored local credentials privately, verifies TLS,
# covers all five operations, and removes only its own temporary task.
node -- scripts/smoke-api.mjs
