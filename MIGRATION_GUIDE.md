# Migration Guide: Atomic Design Refactoring

## Overview

This document provides a comprehensive guide for migrating from the old component structure to the new Atomic Design architecture.

## File Moves and Reorganization

### Component Relocations

#### **Atoms** (Basic UI Elements)

| Old Path                                     | New Path                                        | Component          |
| -------------------------------------------- | ----------------------------------------------- | ------------------ |
| `src/components/ui/button.tsx`               | `src/components/atoms/button.tsx`               | Button             |
| `src/components/ui/input.tsx`                | `src/components/atoms/input.tsx`                | Input              |
| `src/components/ui/label.tsx`                | `src/components/atoms/label.tsx`                | Label              |
| `src/components/ui/badge.tsx`                | `src/components/atoms/badge.tsx`                | Badge              |
| `src/components/ui/avatar.tsx`               | `src/components/atoms/avatar.tsx`               | Avatar             |
| `src/components/ui/checkbox.tsx`             | `src/components/atoms/checkbox.tsx`             | Checkbox           |
| `src/components/ui/separator.tsx`            | `src/components/atoms/separator.tsx`            | Separator          |
| `src/components/ui/skeleton.tsx`             | `src/components/atoms/skeleton.tsx`             | Skeleton           |
| `src/components/ui/textarea.tsx`             | `src/components/atoms/textarea.tsx`             | Textarea           |
| `src/components/ui/background-beams.tsx`     | `src/components/atoms/background-beams.tsx`     | BackgroundBeams    |
| `src/components/ui/canvas-reveal-effect.tsx` | `src/components/atoms/canvas-reveal-effect.tsx` | CanvasRevealEffect |
| `src/components/ui/glowing-stars.tsx`        | `src/components/atoms/glowing-stars.tsx`        | GlowingStars       |
| `src/components/ui/shooting-stars.tsx`       | `src/components/atoms/shooting-stars.tsx`       | ShootingStars      |
| `src/components/ui/sparkles.tsx`             | `src/components/atoms/sparkles.tsx`             | Sparkles           |
| `src/components/ui/stars-background.tsx`     | `src/components/atoms/stars-background.tsx`     | StarsBackground    |
| `src/components/ui/vortex.tsx`               | `src/components/atoms/vortex.tsx`               | Vortex             |

#### **Molecules** (Component Combinations)

| Old Path                              | New Path                                     | Component                   |
| ------------------------------------- | -------------------------------------------- | --------------------------- |
| `src/components/ui/card.tsx`          | `src/components/molecules/card.tsx`          | Card, CardHeader, etc.      |
| `src/components/ui/dialog.tsx`        | `src/components/molecules/dialog.tsx`        | Dialog, DialogContent, etc. |
| `src/components/ui/dropdown-menu.tsx` | `src/components/molecules/dropdown-menu.tsx` | DropdownMenu, etc.          |
| `src/components/ui/popover.tsx`       | `src/components/molecules/popover.tsx`       | Popover, PopoverContent     |
| `src/components/ui/select.tsx`        | `src/components/molecules/select.tsx`        | Select, SelectContent, etc. |
| `src/components/ui/tabs.tsx`          | `src/components/molecules/tabs.tsx`          | Tabs, TabsList, etc.        |
| `src/components/ui/tooltip.tsx`       | `src/components/molecules/tooltip.tsx`       | Tooltip, TooltipContent     |
| `src/components/ui/alert.tsx`         | `src/components/molecules/alert.tsx`         | Alert, AlertDescription     |
| `src/components/ui/alert-dialog.tsx`  | `src/components/molecules/alert-dialog.tsx`  | AlertDialog, etc.           |

#### **Organisms** (Complex Components)

| Old Path                                     | New Path                                            | Component              |
| -------------------------------------------- | --------------------------------------------------- | ---------------------- |
| `src/components/ui/focus-cards.tsx`          | `src/components/organisms/focus-cards.tsx`          | CertificationFocusCard |
| `src/components/ui/focus-cards-exp.tsx`      | `src/components/organisms/focus-cards-exp.tsx`      | ExperienceFocusCard    |
| `src/components/ui/focus-cards-projects.tsx` | `src/components/organisms/focus-cards-projects.tsx` | ProjectFocusCard       |
| `src/components/ui/focus-cards-vol.tsx`      | `src/components/organisms/focus-cards-vol.tsx`      | VolunteerFocusCard     |
| `src/components/ui/hero-parallax.tsx`        | `src/components/organisms/hero-parallax.tsx`        | HeroParallax           |
| `src/components/ui/lens.tsx`                 | `src/components/organisms/lens.tsx`                 | LensComponent          |
| `src/components/ui/skill-lens.tsx`           | `src/components/organisms/skill-lens.tsx`           | SkillLens              |
| `src/components/projects/project-card.tsx`   | `src/components/organisms/project-card.tsx`         | ProjectCards           |
| `src/components/projects/project-grid.tsx`   | `src/components/organisms/project-grid.tsx`         | ProjectGrid            |
| `src/components/experience/card.tsx`         | `src/components/organisms/experience-card.tsx`      | ExperienceCards        |
| `src/components/experience/grid.tsx`         | `src/components/organisms/experience-grid.tsx`      | ExperienceGrid         |

#### **Templates** (Page Layouts)

| Old Path                                         | New Path                                          | Component          |
| ------------------------------------------------ | ------------------------------------------------- | ------------------ |
| `src/components/projects/ProjectPageContent.tsx` | `src/components/templates/ProjectPageContent.tsx` | ProjectPageContent |
| `src/components/projects/ProjectHero.tsx`        | `src/components/templates/ProjectHero.tsx`        | ProjectHero        |
| `src/components/experience/ExperienceHero.tsx`   | `src/components/templates/ExperienceHero.tsx`     | ExperienceHero     |

### Removed Duplicate Files

The following files were removed as they were 95%+ identical to other components:

| Removed File                        | Replaced By                                    | Reason                                     |
| ----------------------------------- | ---------------------------------------------- | ------------------------------------------ |
| `src/components/volunteer/card.tsx` | `src/components/organisms/experience-card.tsx` | 100% duplicate with formatting differences |
| `src/components/volunteer/grid.tsx` | `src/components/organisms/experience-grid.tsx` | 99% duplicate with spacing differences     |

## Import Path Changes

### Pattern-Based Migration

#### Old Import Patterns

```typescript
// Relative paths from UI folder
import { Button } from '../../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Dialog } from '@/components/ui/dialog'
```

#### New Import Patterns

```typescript
// Atomic Design paths
import { Button } from '../../../components/atoms/button'
import { Card } from '../../components/molecules/card'
import { Dialog } from '@/components/molecules/dialog'
```

### Import Mapping Table

#### Atoms

| Old Import                         | New Import                            |
| ---------------------------------- | ------------------------------------- |
| `from '@/components/ui/button'`    | `from '@/components/atoms/button'`    |
| `from '@/components/ui/input'`     | `from '@/components/atoms/input'`     |
| `from '@/components/ui/label'`     | `from '@/components/atoms/label'`     |
| `from '@/components/ui/badge'`     | `from '@/components/atoms/badge'`     |
| `from '@/components/ui/avatar'`    | `from '@/components/atoms/avatar'`    |
| `from '@/components/ui/checkbox'`  | `from '@/components/atoms/checkbox'`  |
| `from '@/components/ui/separator'` | `from '@/components/atoms/separator'` |
| `from '@/components/ui/skeleton'`  | `from '@/components/atoms/skeleton'`  |
| `from '@/components/ui/textarea'`  | `from '@/components/atoms/textarea'`  |

#### Molecules

| Old Import                             | New Import                                    |
| -------------------------------------- | --------------------------------------------- |
| `from '@/components/ui/card'`          | `from '@/components/molecules/card'`          |
| `from '@/components/ui/dialog'`        | `from '@/components/molecules/dialog'`        |
| `from '@/components/ui/dropdown-menu'` | `from '@/components/molecules/dropdown-menu'` |
| `from '@/components/ui/popover'`       | `from '@/components/molecules/popover'`       |
| `from '@/components/ui/select'`        | `from '@/components/molecules/select'`        |
| `from '@/components/ui/tabs'`          | `from '@/components/molecules/tabs'`          |
| `from '@/components/ui/tooltip'`       | `from '@/components/molecules/tooltip'`       |
| `from '@/components/ui/alert'`         | `from '@/components/molecules/alert'`         |
| `from '@/components/ui/alert-dialog'`  | `from '@/components/molecules/alert-dialog'`  |

#### Organisms

| Old Import                                  | New Import                                      |
| ------------------------------------------- | ----------------------------------------------- |
| `from '@/components/ui/hero-parallax'`      | `from '@/components/organisms/hero-parallax'`   |
| `from '@/components/projects/project-card'` | `from '@/components/organisms/project-card'`    |
| `from '@/components/experience/card'`       | `from '@/components/organisms/experience-card'` |

### Automated Migration Script

The following script was used to update imports across the codebase:

```bash
#!/bin/bash
# Find and replace import paths automatically

find src -name "*.tsx" -o -name "*.ts" | while read file; do
    # Update atoms
    sed -i 's|from .*/components/ui/button|from @/components/atoms/button|g' "$file"
    sed -i 's|from .*/components/ui/input|from @/components/atoms/input|g' "$file"
    # ... (additional patterns)

    # Update molecules
    sed -i 's|from .*/components/ui/card|from @/components/molecules/card|g' "$file"
    sed -i 's|from .*/components/ui/dialog|from @/components/molecules/dialog|g' "$file"
    # ... (additional patterns)
done
```

## Type System Migration

### Consolidated Types

#### Before (Duplicated Types)

```typescript
// Old: Multiple similar interfaces
interface ExperienceTimeLine {
  position: string
  start_date: string
  end_date: string
}

interface VolunteerExperienceTimeLine {
  position: string
  start_date: string
  end_date: string
}

interface Experience {
  // Work experience fields
  company_name: string
  company_logo: string
  certificate_url: string
  experience_time_line: ExperienceTimeLine[]
}

interface VolunteerExperience {
  // Volunteer experience fields
  organisation: string
  organisation_logo: string
  volunteer_time_line: VolunteerExperienceTimeLine[]
}
```

#### After (Consolidated Types)

```typescript
// New: Single parameterized interface
interface Timeline {
  position: string
  start_date: string
  end_date: string
}

interface BaseExperience extends EntityWithMetadata, ContentEntity {
  created_by: string
  organization: OrganizationEntity
  timeline: Timeline[]
  type: 'work' | 'volunteer'
}

interface WorkExperience extends BaseExperience {
  type: 'work'
  organization: OrganizationEntity & {
    name: string // company_name
    logo: string // company_logo
  }
  certificate_url: string
}

interface VolunteerExperience extends BaseExperience {
  type: 'volunteer'
  organization: OrganizationEntity & {
    name: string // organisation
    logo: string // organisation_logo
  }
}
```

### Import Migration for Types

#### Before

```typescript
import { Experience, VolunteerExperience, Project } from '@/data/types.data'
```

#### After (Recommended)

```typescript
import { WorkExperience, VolunteerExperience, Project } from '@/models'
```

#### Backward Compatibility (Still Works)

```typescript
import { Experience, VolunteerExperience, Project } from '@/data/types.data'
```

## Breaking Changes

**None!** All changes maintain backward compatibility through:

1. **Legacy type exports** in `/src/data/types.data.ts`
2. **Gradual migration** - old imports continue to work
3. **Preserved interfaces** - existing prop types unchanged

## Verification Steps

After migration, verify the following:

### 1. Lint Check

```bash
pnpm lint
```

Should pass with only the Google Fonts warning.

### 2. Type Check

```bash
pnpm build
```

Should compile without type errors (may fail on network issues but types should be valid).

### 3. Import Resolution

Check that all imports resolve correctly:

```bash
# No "module not found" errors
grep -r "from.*components/ui/" src/
```

Should return no results.

## Common Migration Issues

### 1. Relative Path Conflicts

**Problem**: Import like `from './card'` in organism components
**Solution**: Update to `from '../molecules/card'`

### 2. Missing Index Exports

**Problem**: Import from index file doesn't work
**Solution**: Import directly from specific component file

### 3. Type Import Confusion

**Problem**: Type not found after migration
**Solution**: Import from `@/models` instead of `@/data/types.data`

## Rollback Plan

If issues arise, rollback by:

1. **Restore old UI folder structure**:

   ```bash
   git checkout HEAD~1 -- src/components/ui/
   ```

2. **Revert import changes**:

   ```bash
   git checkout HEAD~1 -- src/app/ src/components/
   ```

3. **Keep consolidated types** (these provide value even without folder restructure)

## Next Steps

1. **Update documentation** - Reference new component locations
2. **Team training** - Educate developers on Atomic Design principles
3. **Storybook update** - Update component stories with new paths
4. **CI/CD** - Ensure build processes work with new structure
5. **Code reviews** - Establish patterns for future component additions

## Questions & Support

For questions about the migration:

1. **Check this guide** for common patterns
2. **Review the README** for architectural decisions
3. **Examine similar components** for implementation examples
4. **Test thoroughly** before committing changes

The migration maintains full backward compatibility while providing a foundation for scalable, maintainable component architecture.
