import { execFileSync } from 'node:child_process';
import { cp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const REPO = process.env.PAYABLE_REPO ?? 'https://github.com/akira-io/payable.git';
const REF = process.env.PAYABLE_REF ?? 'main';
const TMP = new URL('../.payable-src', import.meta.url).pathname;
const DEST = new URL('../_docs_src', import.meta.url).pathname;

async function main() {
  await rm(TMP, { recursive: true, force: true });
  try {
    execFileSync(
      'git',
      ['clone', '--depth', '1', '--branch', REF, '--single-branch', REPO, TMP],
      { stdio: 'inherit' },
    );
  } catch {
    console.warn(`fetch-docs: clone failed, keeping committed _docs_src snapshot`);
    return;
  }

  if (!existsSync(`${TMP}/docs`)) {
    console.warn(`fetch-docs: ${REF} has no docs/, keeping committed _docs_src snapshot`);
    await rm(TMP, { recursive: true, force: true });
    return;
  }

  await rm(DEST, { recursive: true, force: true });
  await mkdir(DEST, { recursive: true });
  await cp(`${TMP}/docs`, DEST, { recursive: true });
  await rm(TMP, { recursive: true, force: true });
  console.log(`fetch-docs: imported docs from ${REPO}#${REF}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
