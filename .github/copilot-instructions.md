# Copilot Instructions for BTS Frontend

## Product goals
- Keep this frontend in a premium fintech style with clean typography, strong hierarchy, and clear call-to-action surfaces.
- Preserve the app’s current functionality while improving UX, layout, and responsiveness.
- Favor clarity and trust over decorative complexity.

## Design system
- Use a consistent Vercel/Geist-inspired design language with strong spacing, soft borders, readable type, and restrained gradients.
- Prefer a light and dark mode that stays accessible and readable.
- Use one visual language across auth flows, dashboard, cards, and transaction panels.

## Engineering rules
- Keep React components readable and modular.
- Validate critical flows with Playwright smoke tests when UI changes touch routing or auth flows.
- Maintain secure token handling and redirect logic.
- Avoid over-styling or breaking existing functionality.

## Quality checks
- Run the frontend build after major UI changes.
- Run Playwright tests for auth and dashboard flows when routing or UI changes affect them.
