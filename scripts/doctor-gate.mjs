#!/usr/bin/env node
/*
 * react-doctor gate — blocks commit / CI when any workspace scores below 100.
 * Parses react-doctor's TTY output (no stable JSON stdout as of v0.x).
 *
 * Pass signal per workspace: either a "100 / 100" score box, OR a
 * "No issues detected" line (which react-doctor emits when dead-code detection
 * fails non-fatally but lint finds nothing — same effective meaning).
 *
 * Fail signal: any non-100 score, or any "N errors" / "N warnings" summary line.
 */
import { spawnSync } from 'node:child_process';

// Strip ANSI so regexes don't get fooled by color codes.
const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');

const result = spawnSync('npx', ['-y', 'react-doctor@latest', '.', '-y'], {
  stdio: ['inherit', 'pipe', 'inherit'],
  encoding: 'utf8',
});

const raw = result.stdout ?? '';
process.stdout.write(raw);
const out = stripAnsi(raw);

// Split per-workspace scan.
const scanBlocks = out.split(/^Scanning /m).slice(1);

if (!scanBlocks.length) {
  console.error('\n\x1b[31mdoctor-gate: no workspace scans detected in output.\x1b[0m');
  process.exit(1);
}

const failures = [];

for (const block of scanBlocks) {
  const workspaceLine = block.split('\n', 1)[0]?.replace(/\.{3}\s*$/, '').trim() ?? 'unknown';
  const passedNoIssues = /No issues detected/.test(block);
  const scoreMatch = block.match(/(\d{1,3})\s*\/\s*100/);
  const hasErrors = /(✗|\bx\b)\s+\d+\s+errors?\b/i.test(block);
  const hasWarnings = /(⚠|!|warning)\s*\d+\s*warnings?/i.test(block) || /\d+\s+warnings?\b/.test(block);

  if (scoreMatch) {
    const score = Number(scoreMatch[1]);
    if (score < 100 || hasErrors || hasWarnings) {
      failures.push({ workspace: workspaceLine, score, hasErrors, hasWarnings });
    }
  } else if (!passedNoIssues) {
    // No score and no clean-pass signal — conservative fail.
    failures.push({ workspace: workspaceLine, score: null, hasErrors, hasWarnings });
  } else if (hasErrors || hasWarnings) {
    failures.push({ workspace: workspaceLine, score: 100, hasErrors, hasWarnings });
  }
}

if (failures.length) {
  console.error('\n\x1b[31mdoctor-gate failed:\x1b[0m');
  for (const f of failures) {
    const detail = [
      f.score != null ? `${f.score}/100` : 'no-score',
      f.hasErrors ? 'errors' : null,
      f.hasWarnings ? 'warnings' : null,
    ]
      .filter(Boolean)
      .join(' · ');
    console.error(`  ${f.workspace}  (${detail})`);
  }
  console.error('\nRun `pnpm doctor` for full diagnostics.');
  process.exit(1);
}

console.log(
  `\n\x1b[32mdoctor-gate passed — ${scanBlocks.length} workspaces clean at 100/100.\x1b[0m`,
);
process.exit(0);
