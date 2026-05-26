import { createTheme, type MantineColorsTuple } from '@mantine/core';

// Custom violet for Teastream brand.
const brand: MantineColorsTuple = [
  '#f4ecff',
  '#e2d4fb',
  '#c2a6f4',
  '#a075ee',
  '#834be8',
  '#7233e5',
  '#6926e4',
  '#591bcb',
  '#4f17b6',
  '#420ea0',
];

export const theme = createTheme({
  primaryColor: 'brand',
  colors: { brand },
  defaultRadius: 'md',
  fontFamily:
    "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  headings: {
    fontFamily:
      "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontWeight: '700',
  },
  cursorType: 'pointer',
  components: {
    Button: {
      defaultProps: { radius: 'md' },
    },
    Card: {
      defaultProps: { radius: 'md', withBorder: true },
    },
    TextInput: { defaultProps: { radius: 'md' } },
    PasswordInput: { defaultProps: { radius: 'md' } },
    Textarea: { defaultProps: { radius: 'md' } },
    Select: { defaultProps: { radius: 'md' } },
  },
});
