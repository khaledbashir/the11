# 🎩 Social Garden Design System - The Aristocrat's Guide

**Philosophy**: *Sophisticated. Professional. Timeless.*

---

## 🎨 Color Palette - The Refined Collection

### Primary Colors
```css
--sg-teal-dark: #0e2e33;      /* Deep Ocean - Main background */
--sg-teal-medium: #1b5e5e;    /* Emerald Depths - Borders, cards */
--sg-mint: #20e28f;           /* Fresh Mint - Accents, CTAs, success */
--sg-black: #000000;          /* Pure Black - Text, overlays */
--sg-white: #ffffff;          /* Crisp White - Primary text */
```

### Neutral Tones
```css
--sg-gray-50: #f9fafb;        /* Whisper - Subtle backgrounds */
--sg-gray-100: #f3f4f6;       /* Mist - Hover states */
--sg-gray-200: #e5e7eb;       /* Fog - Borders, dividers */
--sg-gray-300: #d1d5db;       /* Stone - Disabled states */
--sg-gray-400: #9ca3af;       /* Slate - Secondary text */
--sg-gray-500: #6b7280;       /* Graphite - Placeholder text */
--sg-gray-600: #4b5563;       /* Charcoal - Subtle text */
--sg-gray-700: #374151;       /* Onyx - Dark mode text */
--sg-gray-800: #1f2937;       /* Obsidian - Dark cards */
--sg-gray-900: #111827;       /* Midnight - Deep backgrounds */
```

### Semantic Colors
```css
--sg-success: #20e28f;        /* Success states */
--sg-warning: #f59e0b;        /* Warning states */
--sg-error: #ef4444;          /* Error states */
--sg-info: #3b82f6;           /* Informational states */
```

### Gradient Collection
```css
/* The Signature */
--sg-gradient-primary: linear-gradient(135deg, #0e2e33 0%, #1b5e5e 100%);

/* The Mint Fresh */
--sg-gradient-accent: linear-gradient(135deg, #1b5e5e 0%, #20e28f 100%);

/* The Luxury */
--sg-gradient-gold: linear-gradient(135deg, #d4af37 0%, #f4e5b3 100%);

/* The Depth */
--sg-gradient-deep: linear-gradient(180deg, #000000 0%, #0e2e33 100%);

/* The Glow */
--sg-gradient-glow: radial-gradient(circle, rgba(32, 226, 143, 0.15) 0%, transparent 70%);
```

---

## 📐 Spacing Scale - The Golden Proportions

```css
/* Use consistent spacing throughout */
--space-1: 0.25rem;   /* 4px  - Minimal spacing */
--space-2: 0.5rem;    /* 8px  - Tight spacing */
--space-3: 0.75rem;   /* 12px - Compact */
--space-4: 1rem;      /* 16px - Default spacing */
--space-5: 1.25rem;   /* 20px - Comfortable */
--space-6: 1.5rem;    /* 24px - Spacious */
--space-8: 2rem;      /* 32px - Large gaps */
--space-10: 2.5rem;   /* 40px - Section spacing */
--space-12: 3rem;     /* 48px - Major sections */
--space-16: 4rem;     /* 64px - Hero spacing */
--space-20: 5rem;     /* 80px - Maximum spacing */
```

---

## 🔤 Typography - The Elegant Hierarchy

### Font Families
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-serif: 'Playfair Display', Georgia, serif;
--font-mono: 'Fira Code', 'Courier New', monospace;
```

### Type Scale
```css
/* Display - Hero text */
--text-5xl: 3rem;      /* 48px - Hero headlines */
--text-4xl: 2.5rem;    /* 40px - Major headlines */
--text-3xl: 2rem;      /* 32px - Section headlines */

/* Headings */
--text-2xl: 1.5rem;    /* 24px - Large headings */
--text-xl: 1.25rem;    /* 20px - Medium headings */
--text-lg: 1.125rem;   /* 18px - Small headings */

/* Body */
--text-base: 1rem;     /* 16px - Body text */
--text-sm: 0.875rem;   /* 14px - Secondary text */
--text-xs: 0.75rem;    /* 12px - Captions, labels */
```

### Font Weights
```css
--font-light: 300;     /* Elegant, sparse usage */
--font-normal: 400;    /* Body text default */
--font-medium: 500;    /* Subtle emphasis */
--font-semibold: 600;  /* Strong emphasis */
--font-bold: 700;      /* Headings, CTAs */
```

### Line Heights
```css
--leading-tight: 1.25;    /* Headlines */
--leading-snug: 1.375;    /* Subheadings */
--leading-normal: 1.5;    /* Body text */
--leading-relaxed: 1.625; /* Comfortable reading */
--leading-loose: 2;       /* Spacious, airy */
```

---

## 🎯 Component Patterns - The Aristocrat's Toolkit

### Card - The Foundation
```tsx
<Card className="
  bg-[#0E2E33] 
  border border-[#1b5e5e] 
  rounded-xl 
  p-6
  transition-all duration-300
  hover:border-[#20e28f]
  hover:shadow-lg hover:shadow-[#20e28f]/10
">
  {/* Elegant content */}
</Card>
```

### Button - The Call to Action
```tsx
{/* Primary - The Statement */}
<Button className="
  bg-gradient-to-r from-[#1b5e5e] to-[#0e2e33]
  hover:from-[#20e28f] hover:to-[#1b5e5e]
  text-white font-medium
  px-6 py-2.5
  rounded-lg
  border border-[#1b5e5e]
  transition-all duration-300
  shadow-lg shadow-[#1b5e5e]/20
  hover:shadow-[#20e28f]/30
">
  Analyze
</Button>

{/* Secondary - The Whisper */}
<Button className="
  bg-black/20
  hover:bg-black/30
  text-gray-300
  hover:text-white
  font-medium
  px-6 py-2.5
  rounded-lg
  border border-[#1b5e5e]
  transition-all duration-300
">
  Cancel
</Button>

{/* Tertiary - The Ghost */}
<Button className="
  bg-transparent
  hover:bg-white/5
  text-gray-400
  hover:text-[#20e28f]
  font-medium
  px-4 py-2
  rounded-lg
  transition-all duration-300
">
  Learn More
</Button>
```

### Input - The Refinement
```tsx
<Input className="
  bg-black/20
  border border-[#1b5e5e]
  text-white
  placeholder:text-gray-500
  focus:border-[#20e28f]
  focus:ring-1 focus:ring-[#20e28f]
  rounded-lg
  px-4 py-2.5
  transition-all duration-200
" />
```

### Badge - The Accent
```tsx
{/* Success Badge */}
<span className="
  inline-flex items-center gap-1.5
  px-2.5 py-1
  rounded-md
  bg-[#20e28f]/10
  text-[#20e28f]
  text-xs font-medium
  border border-[#20e28f]/20
">
  Accepted
</span>

{/* Status Badge */}
<span className="
  inline-flex items-center gap-1.5
  px-2.5 py-1
  rounded-md
  bg-blue-500/10
  text-blue-400
  text-xs font-medium
  border border-blue-500/20
">
  Pending
</span>
```

---

## 🎭 Animation Principles - The Grace

### Timing Functions
```css
--ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);      /* Smooth */
--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);         /* Decelerate */
--ease-in: cubic-bezier(0.4, 0.0, 1, 1);            /* Accelerate */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Playful */
```

### Duration Scale
```css
--duration-fast: 150ms;     /* Micro-interactions */
--duration-normal: 200ms;   /* Default transitions */
--duration-slow: 300ms;     /* Deliberate movements */
--duration-slower: 500ms;   /* Dramatic reveals */
```

### Common Animations
```tsx
// Fade In
className="animate-in fade-in duration-300"

// Slide Up
className="animate-in slide-in-from-bottom-4 duration-300"

// Scale
className="transition-transform hover:scale-105 duration-200"

// Glow Effect
className="transition-shadow hover:shadow-lg hover:shadow-[#20e28f]/20 duration-300"
```

---

## 🖼️ Layout Patterns - The Architecture

### The Hero Section
```tsx
<section className="
  relative
  min-h-screen
  flex items-center justify-center
  bg-gradient-to-b from-black to-[#0e2e33]
  overflow-hidden
">
  {/* Gradient Glow Background */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(32,226,143,0.08)_0%,transparent_70%)]" />
  
  {/* Content */}
  <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
    <h1 className="text-5xl font-bold text-white mb-6">
      Sophisticated Title
    </h1>
    <p className="text-xl text-gray-400 mb-8">
      Elegant subtitle that whispers luxury
    </p>
    <Button>Call to Action</Button>
  </div>
</section>
```

### The Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id} className="group cursor-pointer">
      {/* Card content with hover effects */}
    </Card>
  ))}
</div>
```

### The Dashboard Layout
```tsx
<div className="min-h-screen bg-black">
  {/* Sidebar - Fixed */}
  <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0e2e33] border-r border-[#1b5e5e]">
    {/* Navigation */}
  </aside>
  
  {/* Main Content - Padded for sidebar */}
  <main className="ml-64 p-8">
    {/* Dashboard content */}
  </main>
</div>
```

---

## 🌟 Special Effects - The Flourish

### Glassmorphism
```tsx
<div className="
  bg-white/5
  backdrop-blur-xl
  border border-white/10
  rounded-2xl
  p-6
">
  {/* Content appears to float */}
</div>
```

### Gradient Text
```tsx
<h1 className="
  bg-gradient-to-r from-[#20e28f] to-[#1b5e5e]
  bg-clip-text text-transparent
  font-bold text-4xl
">
  Gradient Headline
</h1>
```

### Glow Effect
```tsx
<div className="
  relative
  before:absolute before:inset-0
  before:bg-gradient-to-r before:from-[#20e28f]/20 before:to-transparent
  before:blur-2xl before:-z-10
  before:opacity-0 hover:before:opacity-100
  before:transition-opacity before:duration-500
">
  {/* Content glows on hover */}
</div>
```

---

## 📱 Responsive Breakpoints - The Adaptability

```css
/* Mobile First Approach */
sm: 640px   /* Small tablets, large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Small desktops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large displays */
```

### Usage Pattern
```tsx
<div className="
  px-4 sm:px-6 md:px-8
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-4 md:gap-6 lg:gap-8
">
  {/* Responsive grid */}
</div>
```

---

## ✨ The Golden Rules

1. **Consistency is Royalty** - Use the same patterns everywhere
2. **White Space is Luxury** - Don't be afraid of generous spacing
3. **Subtle > Flashy** - Elegance whispers, it doesn't shout
4. **Hierarchy is Clear** - Guide the eye with purposeful contrast
5. **Interactions are Smooth** - Every transition feels intentional
6. **Dark Mode First** - Our brand lives in sophisticated darkness
7. **Accessibility Matters** - Elegance includes everyone
8. **Performance is Paramount** - Speed is the ultimate luxury

---

## 🎩 Implementation Checklist

- [ ] All colors from the palette
- [ ] Consistent spacing scale
- [ ] Proper typography hierarchy
- [ ] Smooth transitions (200-300ms)
- [ ] Hover states on interactive elements
- [ ] Focus states for accessibility
- [ ] Responsive at all breakpoints
- [ ] Dark mode considerations
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Success states

---

*"Sophistication is simplicity executed with excellence."*
