#!/usr/bin/env bash
# exit on error
set -o errexit

echo "=== Installing frontend dependencies ==="
npm install

echo "=== Building React frontend ==="
npm run build

echo "=== Installing Python dependencies ==="
pip install -r requirements.txt