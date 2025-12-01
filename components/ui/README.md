# UI Components

This directory contains reusable UI components for the ArbiSlice application.

## Components

### IconButton

A flexible button component with FontAwesome icon support.

**Features:**
- Multiple variants (primary, secondary, ghost, danger, success)
- Size options (sm, md, lg)
- Loading state with spinner
- Icon positioning (left/right)
- Optional label display
- Custom gradient support
- Framer Motion animations

**Usage:**
```tsx
import { IconButton } from '@/components/ui'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

<IconButton
  icon={faPlay}
  label="Play Game"
  variant="primary"
  size="md"
  onClick={handlePlay}
/>
```

### ErrorBoundary

React Error Boundary component for catching and displaying errors gracefully.

**Features:**
- Catches React component errors
- Custom fallback UI
- Error details display
- Reset functionality
- Home navigation option

**Usage:**
```tsx
import { ErrorBoundary } from '@/components/ui'

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### Toast

Toast notification system for user feedback.

**Features:**
- Multiple types (success, error, info, warning)
- Auto-dismiss with configurable duration
- Progress bar animation
- Manual dismiss option
- Stack multiple toasts
- Customizable styling

**Usage:**
```tsx
import { ToastContainer, useToast } from '@/components/ui'

function MyComponent() {
  const { success, error, info, warning, toasts, removeToast } = useToast()

  return (
    <>
      <button onClick={() => success('Operation completed!')}>
        Show Success
      </button>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
```

## Hooks

### useDebounce

Debounce a value to reduce unnecessary updates.

```tsx
import { useDebounce } from '@/hooks/use-debounce'

const debouncedSearch = useDebounce(searchTerm, 500)
```

### useThrottle

Throttle function calls to limit execution frequency.

```tsx
import { useThrottle } from '@/hooks/use-debounce'

const throttledScroll = useThrottle(handleScroll, 200)
```

## Utilities

See `/lib/utils.ts` for additional utility functions:
- `formatNumber` - Format numbers with commas
- `formatLargeNumber` - Format large numbers (K, M, B)
- `truncateAddress` - Truncate Ethereum addresses
- `formatDuration` - Format seconds to human-readable time
- `copyToClipboard` - Copy text to clipboard
- And more...


