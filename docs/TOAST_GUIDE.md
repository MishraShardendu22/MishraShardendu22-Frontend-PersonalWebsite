# Custom Toast Notifications

This project uses a customized implementation of `react-hot-toast` that matches the website's theme and provides a consistent user experience across light and dark modes.

## Features

- 🎨 **Theme-aware**: Automatically adapts to light/dark mode using CSS variables
- 🎯 **Pre-styled variants**: Success, Error, Info, Warning, and Loading
- 🌈 **Gradient backgrounds**: Beautiful gradient overlays matching your brand colors
- 💫 **Backdrop blur**: Modern glassmorphism effect
- 🔔 **Promise support**: Handle async operations with loading → success/error states
- 📱 **Mobile-optimized**: Responsive design that works great on all devices

## Usage

### Import the custom toast utility

```typescript
import { showToast } from '@/lib/toast'
```

### Basic Usage

#### Success Toast

```typescript
showToast.success('Operation completed successfully!')
```

#### Error Toast

```typescript
showToast.error('Something went wrong!')
```

#### Info Toast

```typescript
showToast.info("Here's some useful information")
```

#### Warning Toast

```typescript
showToast.warning('Please review this action')
```

#### Loading Toast

```typescript
const toastId = showToast.loading('Processing your request...')

// Later, dismiss it
showToast.dismiss(toastId)
```

### Advanced Usage

#### Promise Toast

Automatically handles loading → success/error states:

```typescript
showToast.promise(
  fetch('/api/data').then((res) => res.json()),
  {
    loading: 'Fetching data...',
    success: 'Data loaded successfully!',
    error: 'Failed to load data',
  }
)
```

With dynamic messages:

```typescript
showToast.promise(saveData(userData), {
  loading: 'Saving...',
  success: (data) => `Successfully saved ${data.name}!`,
  error: (err) => `Error: ${err.message}`,
})
```

#### Custom Options

All toast methods accept optional configuration:

```typescript
showToast.success('Custom toast!', {
  duration: 5000, // 5 seconds
  position: 'bottom-center',
  style: {
    fontSize: '16px',
    // Add any custom styles
  },
})
```

#### Dismiss Toasts

```typescript
// Dismiss a specific toast
const id = showToast.success('Message')
showToast.dismiss(id)

// Dismiss all toasts
showToast.dismiss()
```

### Custom Toast

For complete control, use the custom method:

```typescript
showToast.custom('Custom message', {
  icon: '🎉',
  duration: 6000,
  style: {
    background: 'linear-gradient(to right, #f093fb, #f5576c)',
    color: 'white',
  },
})
```

## Toast Options

### Global Options

Set in `ToasterClient.tsx`:

- `position`: `'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'`
- `duration`: Default duration in milliseconds
- `reverseOrder`: Whether to reverse the order of toasts
- `gutter`: Spacing between toasts

### Individual Toast Options

- `duration`: How long the toast should be visible
- `icon`: Custom icon (string or React element)
- `style`: Custom CSS styles
- `className`: Custom CSS class
- `position`: Override global position for this toast
- `ariaProps`: Accessibility properties

## Theme Integration

The toasts automatically use your CSS variables:

- **Background**: `--card`
- **Text**: `--card-foreground`
- **Borders**: `--border`, `--primary`, `--destructive`, etc.
- **Icons**: Theme-specific colors based on variant

### Light Mode Colors

- Success: Green gradient (`--primary`)
- Error: Red gradient (`--destructive`)
- Info: Blue gradient (`--accent`)
- Warning: Yellow-green gradient (`--secondary`)

### Dark Mode Colors

Automatically switches to OLED-friendly dark theme variants.

## Migration Guide

### From Standard toast

**Before:**

```typescript
import toast from 'react-hot-toast'

toast.success('Success!')
toast.error('Error!')
```

**After:**

```typescript
import { showToast } from '@/lib/toast'

showToast.success('Success!')
showToast.error('Error!')
```

### Keeping Standard toast

If you need the original toast for specific use cases:

```typescript
import { toast } from '@/lib/toast' // Re-exported original

toast('Custom toast', {
  // Standard react-hot-toast options
})
```

## Examples from the Codebase

### API Error Handling

```typescript
try {
  const data = await fetchData()
  showToast.success('Data loaded successfully!')
} catch (error) {
  showToast.error(error.message || 'Failed to load data')
}
```

### Form Submission

```typescript
const handleSubmit = async (formData) => {
  showToast.promise(submitForm(formData), {
    loading: 'Submitting form...',
    success: 'Form submitted successfully!',
    error: 'Failed to submit form',
  })
}
```

### Delete Confirmation

```typescript
const handleDelete = async (id: string) => {
  const toastId = showToast.loading('Deleting...')

  try {
    await deleteItem(id)
    showToast.dismiss(toastId)
    showToast.success('Item deleted successfully!')
  } catch (error) {
    showToast.dismiss(toastId)
    showToast.error('Failed to delete item')
  }
}
```

## Customization

### Modify Global Styles

Edit `src/components/extra/ToasterClient.tsx` to change default styles:

```typescript
toastOptions={{
  duration: 4000,
  style: {
    // Your custom default styles
  },
}}
```

### Create New Variants

Add new variants in `src/lib/toast.ts`:

```typescript
export const showToast = {
  // ... existing variants

  premium: (message: string, options?: any) => {
    return toast(message, {
      icon: '⭐',
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        // ... more styles
      },
      ...options,
    })
  },
}
```

## Best Practices

1. **Use appropriate variants**: Choose the right toast type for the context
2. **Keep messages concise**: Short, clear messages work best
3. **Use promise toasts for async operations**: Provides better UX
4. **Don't overuse**: Too many toasts can be annoying
5. **Dismiss when necessary**: Clean up loading toasts when done
6. **Provide context**: Include relevant information in error messages

## Accessibility

All toasts include:

- ARIA live regions for screen readers
- Keyboard dismissible (Escape key)
- Focus management
- Semantic HTML structure

## Browser Support

Works in all modern browsers that support:

- CSS Variables
- CSS Backdrop Filter
- ES6+

## Troubleshooting

### Toasts not appearing

- Check if `<ToasterClient />` is in your root layout
- Verify CSS variables are defined in `globals.css`

### Styling issues

- Clear browser cache
- Check for CSS conflicts
- Verify Tailwind CSS is configured properly

### TypeScript errors

- Ensure type definitions are imported
- Check `tsconfig.json` includes the lib folder
