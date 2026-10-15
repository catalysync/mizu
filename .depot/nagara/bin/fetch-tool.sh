#!/usr/bin/env bash
# fetch-tool.sh - install one pinned CI tool, checked against its published sha256.
#
#   .depot/nagara/bin/fetch-tool.sh <gitleaks|actionlint|hadolint|zizmor|osv-scanner>
#
# Installs into $NAGARA_TOOL_DIR (default $RUNNER_TEMP/nagara-bin, else
# ~/.local/bin), prints the binary's path, and appends the directory to
# $GITHUB_PATH when it is set. Linux x86_64 only: these are the Depot CI sandbox
# builds. On a Mac, install the same versions from the release pages by hand.
#
# This table is the one place the kit pins tool binaries. Renovate does not see
# it; bump the version and sha256 together, from the release's checksum file.
set -euo pipefail

tool="${1:?usage: fetch-tool.sh <gitleaks|actionlint|hadolint|zizmor|osv-scanner>}"
case "$tool" in
  gitleaks)
    ver=8.30.1
    url="https://github.com/gitleaks/gitleaks/releases/download/v${ver}/gitleaks_${ver}_linux_x64.tar.gz"
    sha=551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb; kind=tgz; member=gitleaks ;;
  actionlint)
    ver=1.7.12
    url="https://github.com/rhysd/actionlint/releases/download/v${ver}/actionlint_${ver}_linux_amd64.tar.gz"
    sha=8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8; kind=tgz; member=actionlint ;;
  hadolint)
    ver=2.15.1
    url="https://github.com/hadolint/hadolint/releases/download/v${ver}/hadolint-linux-x86_64"
    sha=c7187db94eeeeca956519a6af171adc31453941a1e777961f6e680f697c8c507; kind=bin; member=hadolint ;;
  zizmor)
    ver=1.30.1
    url="https://github.com/zizmorcore/zizmor/releases/download/v${ver}/zizmor-x86_64-unknown-linux-gnu.tar.gz"
    sha=e65324f4430c2717591937edcec90ccbefaf14c174f8ec9415e03ca875b46e1a; kind=tgz; member=zizmor ;;
  osv-scanner)
    ver=2.6.0
    url="https://github.com/google/osv-scanner/releases/download/v${ver}/osv-scanner_linux_amd64"
    sha=ca69b3d3cd08f889a49dc0a383122f71cc528b83803671df5fd874d97485b108; kind=bin; member=osv-scanner ;;
  *) echo "fetch-tool: unknown tool '$tool'" >&2; exit 2 ;;
esac

[ "$(uname -s)-$(uname -m)" = "Linux-x86_64" ] || {
  echo "fetch-tool: pinned builds are Linux x86_64; this is $(uname -s)-$(uname -m)" >&2; exit 2; }

dir="${NAGARA_TOOL_DIR:-${RUNNER_TEMP:+$RUNNER_TEMP/nagara-bin}}"; dir="${dir:-$HOME/.local/bin}"
mkdir -p "$dir"
if [ -x "$dir/$member" ] && [ -f "$dir/.$member.$ver" ]; then echo "$dir/$member"; exit 0; fi

work="$(mktemp -d)"; trap 'rm -rf "$work"' EXIT
curl -fsSL --retry 3 -o "$work/dl" "$url"
echo "$sha  $work/dl" | sha256sum -c --quiet - >&2 || { echo "fetch-tool: CHECKSUM MISMATCH for $tool $ver" >&2; exit 1; }
if [ "$kind" = tgz ]; then
  mkdir "$work/x"; tar -xzf "$work/dl" -C "$work/x"
  src="$(find "$work/x" -type f -name "$member" | head -1)"
  [ -n "$src" ] || { echo "fetch-tool: $member not found in archive" >&2; exit 1; }
else
  src="$work/dl"
fi
install -m 0755 "$src" "$dir/$member"
touch "$dir/.$member.$ver"
[ -n "${GITHUB_PATH:-}" ] && echo "$dir" >> "$GITHUB_PATH"
echo "$dir/$member"
