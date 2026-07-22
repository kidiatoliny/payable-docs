# Reference Before Examples Navigation Design

## Goal

Keep the documentation reading order semantic by placing the `Examples` group immediately after the `Reference` group whenever both groups exist.

## Behavior

- Preserve the original order of every group except `Examples`.
- When `Reference` and `Examples` both exist, move `Examples` immediately after `Reference`.
- When either group is absent, preserve the complete original order.
- Apply the normalized navigation before it is shared with the desktop sidebar, mobile navigation, pagination, and `llms.txt` output.

## Implementation

Add a small pure ordering function to the navigation module and call it on the final group list returned by `buildNav`. Compare the exact group labels `Reference` and `Examples`; no content titles, file prefixes, or directory names participate in the rule.

This keeps editorial order separate from document storage order and avoids changing unrelated groups.

## Validation

- Add a regression test with `Examples` before `Reference` and confirm the result is `Reference`, then `Examples`.
- Confirm unrelated groups retain their relative order.
- Confirm lists missing either `Reference` or `Examples` remain unchanged.
- Run the project test suite and production build.
- Run `composer test` as required by the global workspace instructions before opening the pull request.
