# Regex Prepared Statements
**SQL like prepared statements for regular expressions**

![license](https://img.shields.io/npm/l/regex-prepared-statements)
![npm](https://img.shields.io/npm/v/regex-prepared-statements)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/regex-prepared-statements)

Regex prepared statements helps with sanitizing user inputs for usage in regular expression statements.

Similar to SQL's `?`, this library uses a sequence of special characters `<_>` that will be replaced with sanitized
inputs via `escape-string-regexp` as a peer dependency.

```
npm install regex-prepared-statements
```

Additionally you'll need to install the peer dependency `escape-string-regexp`
```
npm install escape-string-regexp
```


## Example usages

Simple replacement:
```typescript
regexp('^foo<_>baz$')('bar') // Produces a regex '^foobarbaz$'
```

Passing flags:
```typescript
regexp('^foo<_>baz$', 'i)'('bar') // Produces a regex '^foobarbaz$'
```

Multiple place holders:
```typescript
regexp('^<_><_><_>$')('foo', 'bar', 'baz') // Produces a regex '^foobarbaz$'
```

Regex syntax within a placeholder:
```typescript
regexp('_<>_<_>?/?_<_>?.*')('.*)*.*///', '<_>')) // Produces a regex '_<>_\\.\\*\\)\\*\\.\\*\\/\\/\\/?\\/?_<_>?.*'
```