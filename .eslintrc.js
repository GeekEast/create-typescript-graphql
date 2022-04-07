module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "plugin:prettier/recommended" // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: ["@typescript-eslint", "simple-import-sort", "import"],
  env: {
    node: true,
    es6: true,
    mocha: true
  },
  globals: {
    $: true
  },
  rules: {
    "no-console": "error",
    eqeqeq: ["warn", "always"],
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": ["warn"],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "prettier/prettier": "error",
    "prefer-const": ["error", { destructuring: "all", ignoreReadBeforeAssign: true }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/triple-slash-reference": ["error", { path: "always", types: "never", lib: "never" }],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "import/no-useless-path-segments": ["error"],
    "@typescript-eslint/ban-types": ["error", { types: { Function: false, Object: false } }]
  },
  overrides: [
    {
      files: ["*.test.ts", "jest.setup.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off"
      }
    }
  ]
}
