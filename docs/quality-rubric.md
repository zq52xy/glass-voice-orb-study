# Content Quality Contract

## Target

Keep the public repository documentation accurate for a non-commercial, source-available study. Documentation must not imply commercial permission, official affiliation, hidden provenance, or reusable rights for the included personal background asset.

Public-facing release documents should be bilingual in English and Chinese when they explain repository purpose, attribution, asset rights, and license restrictions.

## Audience

Readers who inspect or fork the project on GitHub, including developers studying the WebGL technique and maintainers reviewing whether the repository can be published.

## Surface

- `README.md`
- `NOTICE.md`
- `LICENSE`
- `CLAUDE.md` project map entries that describe documentation or release responsibilities

## Core User Paths

1. A reader can understand that the repository is for learning and non-commercial experimentation only.
2. A reader can find shader/source attribution without searching source files.
3. A reader can distinguish source code visibility from reusable or commercial asset rights.
4. A Chinese reader and an English reader receive the same practical restrictions and attribution trail.

## Invariants

- Do not describe the project as OSI open source while the license is source-available and non-commercial.
- Keep Shadertoy provenance visible when shader attribution is discussed.
- Keep any additional public reference attribution that is still represented by copied, ported, or adapted code.
- State that the included background image is a personal demo asset and not licensed for standalone reuse or commercial use.
- Do not imply affiliation with Apple, Siri, Shadertoy, or any referenced author.
- Keep bilingual statements semantically aligned; do not let the Chinese text loosen the English license, or the English text omit Chinese-facing restrictions.

## Gates

- Review `README.md`, `NOTICE.md`, and `LICENSE` together for licensing consistency.
- Search public docs for stale or conflicting attribution language.
- Check bilingual sections for matching non-commercial, attribution, and asset-use restrictions.
- Record the review result in `eval/evidence-report.md` or a targeted evidence note.

## Warnings

If the implementation is changed to remove code derived from an attributed reference, update `NOTICE.md` in the same change. Do not remove attribution just to simplify public presentation.

## Review

Human review should confirm whether the repository owner wants source attribution to be broad provenance or limited to implementation-derived sources only.

## Evidence

Evidence and release-readiness notes live in `eval/evidence-report.md`.

## Baseline Policy

This rubric may change when the repository license, asset permission, source provenance, or intended publication model changes.
