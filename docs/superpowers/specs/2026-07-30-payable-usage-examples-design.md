# Payable Usage Examples Design

## Goal

Publish a maintained `Examples` section for Payable with task-focused recipes, including a complete multi-provider workflow.

## Source of truth

The Payable repository owns the example content under `docs/examples/`. Its existing deployment workflow mirrors `docs/` into the `_docs_src/` directory of `payable-docs`. The documentation site owns only navigation, rendering, and synchronized output.

The root `docs/00-index.md` remains the complete repository catalog. It gains an `Examples` section, but it does not control production navigation because the site synchronizer intentionally skips that root index.

## Example catalog

Create ten recipes in this order:

1. Stripe checkout
2. Multi-provider with Stripe and Paddle
3. Subscriptions
4. Charges and refunds
5. Webhooks and reconciliation
6. Fastify with Knex
7. NestJS with Prisma
8. SISP redirect checkout
9. Revolut Merchant checkout
10. MCP server

Each recipe contains prerequisites, complete configuration, the primary operation, the expected result, and relevant failure behavior. Recipes link to reference documentation for exhaustive API details instead of duplicating it.

## Multi-provider contract

The multi-provider recipe demonstrates:

- Registration of Stripe and Paddle in one `createPayable` configuration.
- Explicit provider selection through `payable.customer(billable, providerName)`.
- The first registered provider as the implicit default and why explicit selection is safer.
- Refund routing through the provider stored on the original payment.
- Provider-scoped webhook delivery through `/webhooks/:provider`.
- The ambiguous webhook error produced when several providers are registered without a provider name.

## Navigation

Add an `Examples` group to the `payable-docs` navigation builder. Match pages whose first path segment is `examples` and place the group immediately after `Operations and reference`.

Remove the generic reordering function currently proposed in pull request #14. Test `buildNav` with real example and reference-shaped entries so the regression covers group creation and final ordering rather than an unreachable helper.

The same navigation result continues to feed the desktop sidebar, mobile navigation, pagination, and `llms.txt`.

## Validation

- Expand `tests/docs-examples.test.ts` in Payable so the central configurations and operations used by the recipes typecheck and execute without external network calls.
- Add source checks for the ten Markdown pages and their index entries.
- Test the `payable-docs` navigation through `buildNav` and confirm `Examples` follows `Operations and reference`.
- Run the complete Payable test command before its pull request.
- Run `npm test` and `npm run build` in `payable-docs` before updating pull request #14.

## Delivery

Use two coordinated changes:

1. A Payable pull request adds the source examples, index entries, and executable documentation tests.
2. Pull request #14 in `payable-docs` is amended to create and position the real navigation group.

After the Payable change reaches `main`, its existing workflow synchronizes the new pages into the documentation repository. No second source of example content is maintained manually.
