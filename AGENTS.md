# Project Styling & Execution Instructions

## CSS & Styling Rules (Strictly Enforced)

1. **NO Inline CSS**: Do not use `style={{ ... }}` in JSX or HTML elements under any circumstances.
2. **NO Tailwind CSS**: Do not use Tailwind utility classes (e.g. `flex`, `bg-blue-500`, `p-4`, `text-center`, etc.).
3. **Use Custom CSS Design System**: Always use the class-based CSS design system located in `/src/styles/` powered by design tokens in `/src/styles/tokens/`.
4. **NO `!important`**: Never use `!important` in CSS declarations.
5. **Class Names & CSS Tokens**: All styles must use CSS classes defined in modular `.css` files under `/src/styles/` and reference variables like `var(--color-...)`, `var(--space-...)`, `var(--radius-...)`, `var(--font-...)`, etc.
