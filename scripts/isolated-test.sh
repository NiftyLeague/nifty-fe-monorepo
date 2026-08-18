#!/usr/bin/env bash
# Run each test file in isolation to avoid mock.module() leakage
# Usage: ./scripts/isolated-test.sh [test-file-pattern]

set -euo pipefail

ROOT="/Users/amf/Developer/NiftyLeague/nifty-fe-monorepo"
cd "$ROOT"

if [ $# -gt 0 ]; then
  files=("$@")
else
  # Find all test files excluding node_modules, .next, build, .vercel
  files=()
  while IFS= read -r f; do
    [ -n "$f" ] && files+=("$f")
  done < <(find . -name "*.test.ts" -o -name "*.test.tsx" | grep -v node_modules | grep -v '/\.next/' | grep -v '/build/' | grep -v '/\.vercel/' | grep -v '/dist/' | sort)
fi

total_pass=0
total_fail=0
total_skip=0
total_error=0
total_tests=0
failed_files=()
skipped_files=()

echo "Running ${#files[@]} test files in isolation..."
echo ""

for f in "${files[@]}"; do
  # Run single test file, capture summary line
  result=$(bun test "$f" --max-concurrency=1 2>&1 | tail -5)

  # Extract counts
  pass=$(echo "$result" | grep -oP '\d+(?= pass)' || echo 0)
  fail=$(echo "$result" | grep -oP '\d+(?= fail)' || echo 0)
  skip=$(echo "$result" | grep -oP '\d+(?= skip)' || echo 0)
  error=$(echo "$result" | grep -oP '\d+(?= error)' || echo 0)
  tests=$(echo "$result" | grep -oP 'Ran \K\d+' || echo 0)

  total_pass=$((total_pass + pass))
  total_fail=$((total_fail + fail))
  total_skip=$((total_skip + skip))
  total_error=$((total_error + error))
  total_tests=$((total_tests + tests))

  status="PASS"
  if [ "$fail" -gt 0 ] || [ "$error" -gt 0 ]; then
    status="FAIL"
    failed_files+=("$f")
  fi
  if [ "$skip" -gt 0 ]; then
    status="SKIP"
    skipped_files+=("$f")
  fi

  printf "%-80s %s\n" "$f" "$status (pass=$pass fail=$fail skip=$skip error=$error)"
done

echo ""
echo "========================================="
echo "ISOLATED TEST SUMMARY"
echo "========================================="
echo "Files tested:    ${#files[@]}"
echo "Total tests run: $total_tests"
echo "Passed:          $total_pass"
echo "Failed:          $total_fail"
echo "Skipped:         $total_skip"
echo "Errors:          $total_error"
echo ""
if [ ${#failed_files[@]} -gt 0 ]; then
  echo "FAILED FILES:"
  for f in "${failed_files[@]}"; do
    echo "  - $f"
  done
fi
if [ ${#skipped_files[@]} -gt 0 ]; then
  echo ""
  echo "SKIPPED FILES:"
  for f in "${skipped_files[@]}"; do
    echo "  - $f"
  done
fi
