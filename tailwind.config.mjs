import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: "var(--font-poppins)",
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            // -- Base Colors --
            "--tw-prose-body": theme("colors.gray.800"),
            "--tw-prose-headings": theme("colors.black"),
            "--tw-prose-links": theme("colors.blue.600"),
            "--tw-prose-bold": theme("colors.black"),
            "--tw-prose-bullets": theme("colors.gray.500"),
            "--tw-prose-hr": theme("colors.gray.200"),
            "--tw-prose-quotes": theme("colors.black"),
            "--tw-prose-quote-borders": theme("colors.gray.200"),
            "--tw-prose-code": theme("colors.pink.600"),
            "--tw-prose-th-borders": theme("colors.gray.300"),
            "--tw-prose-td-borders": theme("colors.gray.200"),

            // -- Inverted (Dark Mode) Colors --
            "--tw-prose-invert-body": theme("colors.gray.300"),
            "--tw-prose-invert-headings": theme("colors.white"),
            "--tw-prose-invert-links": theme("colors.blue.400"),
            "--tw-prose-invert-bold": theme("colors.white"),
            "--tw-prose-invert-bullets": theme("colors.gray.500"),
            "--tw-prose-invert-hr": theme("colors.gray.800"),
            "--tw-prose-invert-quotes": theme("colors.gray.100"),
            "--tw-prose-invert-quote-borders": theme("colors.gray.700"),
            "--tw-prose-invert-code": theme("colors.pink.400"),
            "--tw-prose-invert-th-borders": theme("colors.gray.600"),
            "--tw-prose-invert-td-borders": theme("colors.gray.700"),

            // -- Base styles --
            p: {
              lineHeight: "1.7",
            },
            h1: { fontSize: "2em" },
            h2: {
              fontSize: "1.5em",
              marginTop: "2.5em",
              marginBottom: "1.25em",
              borderBottomColor: "var(--tw-prose-hr)",
            },
            h3: {
              fontSize: "1.2em",
              marginTop: "2em",
              marginBottom: "1em",
            },

            // -- Code Blocks --
            "--tw-prose-pre-bg": "transparent",
            "--tw-prose-invert-pre-bg": "transparent",
            pre: {
              marginTop: 0,
              marginBottom: 0,
              backgroundColor: "var(--tw-prose-pre-bg)",
            },
            code: {
              backgroundColor: "rgba(125, 125, 125, 0.1)",
              padding: "0.2em 0.4em",
              borderRadius: "0.25rem",
              fontWeight: "400",
            },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
            "pre code": {
              backgroundColor: "transparent",
              padding: 0,
              borderRadius: 0,
            },

            // -- Table Borders --
            "thead th": {
              borderBottomColor: "var(--tw-prose-th-borders)",
            },
            "tbody td": {
              borderBottomColor: "var(--tw-prose-td-borders)",
              borderLeftColor: "var(--tw-prose-td-borders)",
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
}; 