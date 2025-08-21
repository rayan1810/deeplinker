# @deeplinker/sdk-react-native

A tiny React Native SDK for consuming deep links from the DeepLinker service.

## Installation

```bash
npm install @deeplinker/sdk-react-native
# or
yarn add @deeplinker/sdk-react-native
# or
pnpm add @deeplinker/sdk-react-native
```

## Usage

### Building Deep Links

```typescript
import { buildDeeplink } from "@deeplinker/sdk-react-native";

// Basic deep link
const url = buildDeeplink({
  baseUrl: "https://yourdomain.com",
  slug: "welcome",
});
// Result: https://yourdomain.com/l/welcome

// With query parameters
const urlWithParams = buildDeeplink({
  baseUrl: "https://yourdomain.com",
  slug: "product",
  params: {
    id: "123",
    category: "electronics",
    featured: true,
  },
});
// Result: https://yourdomain.com/l/product?id=123&category=electronics&featured=true
```

### Parsing Deep Links

```typescript
import { parseDeeplink } from "@deeplinker/sdk-react-native";

// Parse incoming deep link
const { slug, params } = parseDeeplink(
  "https://yourdomain.com/l/welcome?source=email&utm_campaign=welcome"
);

console.log(slug); // 'welcome'
console.log(params); // { source: 'email', utm_campaign: 'welcome' }
```

### Opening Deep Links

```typescript
import { openDeeplink } from "@deeplinker/sdk-react-native";

// Open a deep link
try {
  await openDeeplink("https://yourdomain.com/l/welcome");
} catch (error) {
  console.error("Failed to open deep link:", error);
}
```

## API Reference

### `buildDeeplink(args: BuildDeeplinkArgs): string`

Builds a deep link URL with optional query parameters.

**Parameters:**

- `baseUrl`: The base URL of your DeepLinker service
- `slug`: The slug identifier for the deep link
- `params`: Optional query parameters to include

**Returns:** A complete deep link URL

### `parseDeeplink(url: string): { slug: string; params: Record<string, string> }`

Parses a deep link URL to extract the slug and query parameters.

**Parameters:**

- `url`: The deep link URL to parse

**Returns:** An object containing the slug and parameters

### `openDeeplink(url: string): Promise<void>`

Opens a deep link URL using React Native's Linking API.

**Parameters:**

- `url`: The deep link URL to open

**Throws:** Error if the URL cannot be opened

## Example Integration

```typescript
import React from 'react'
import { View, Button, Alert } from 'react-native'
import { buildDeeplink, openDeeplink } from '@deeplinker/sdk-react-native'

export default function DeepLinkExample() {
  const handleOpenWelcomeLink = async () => {
    try {
      const url = buildDeeplink({
        baseUrl: 'https://yourdomain.com',
        slug: 'welcome',
        params: {
          source: 'app',
          timestamp: Date.now()
        }
      })

      await openDeeplink(url)
    } catch (error) {
      Alert.alert('Error', 'Failed to open deep link')
    }
  }

  return (
    <View>
      <Button title="Open Welcome Link" onPress={handleOpenWelcomeLink} />
    </View>
  )
}
```

## Testing

Run the unit tests:

```bash
npm test
```

## Requirements

- React Native >= 0.60.0
- iOS 9.0+ / Android API level 21+
