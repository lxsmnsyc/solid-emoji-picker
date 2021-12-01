module.exports = {
  "root": true,
  "extends": [
    "lxsmnsyc/typescript/react"
  ],
  "parserOptions": {
    "project": "./tsconfig.eslint.json",
    "tsconfigRootDir": __dirname,
  },
  "rules": {
    "react/destructuring-assignment": "off",
    "react/no-unknown-property": "off",
    "react/require-default-props": "off"
  }
};
