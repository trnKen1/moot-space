#!/usr/bin/env node
// Runs this workspace's Python with whatever args it's given, picking the
// interpreter per-platform so the npm scripts work on Windows and POSIX alike.
//
// The workspace venv comes first: on this project's Windows setup a bare
// `python` inside an npm-spawned shell resolves to the App-execution-alias /
// pymanager stub rather than the venv (see docs/decisions.md, 2026-09-04).
// PATH is the fallback, which is what CI uses — there's no venv on the runner.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const serviceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const isWindows = process.platform === 'win32';
const venvPython = isWindows
  ? path.join(serviceRoot, '.venv', 'Scripts', 'python.exe')
  : path.join(serviceRoot, '.venv', 'bin', 'python');

const interpreter = existsSync(venvPython)
  ? venvPython
  : (isWindows ? 'python' : 'python3');

const result = spawnSync(interpreter, process.argv.slice(2), {
  stdio: 'inherit',
  cwd: serviceRoot,
});

if (result.error) {
  console.error(`py.mjs: could not run ${interpreter}: ${result.error.message}`);
  process.exit(1);
}

// Killed by a signal (e.g. Ctrl-C on `runserver`) reports a null status.
process.exit(result.status ?? 1);
