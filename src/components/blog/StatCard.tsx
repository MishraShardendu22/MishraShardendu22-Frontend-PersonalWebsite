import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  variant?: 'primary' | 'accent' | 'blue' | 'green' | 'purple' | 'orange'
  className?: string
  trend?: {
    value: number
    label: string
  }
}

const variantStyles = {
  primary: {
    gradient: 'from-primary/10 via-primary/5 to-transparent',
    border: 'border-primary/20 hover:border-primary/40',
    iconBg: 'bg-primary/20',
    iconColor: 'text-primary',
    textHover: 'group-hover:text-primary',
    shimmer: 'via-primary/10',
  },
  accent: {
    gradient: 'from-accent/10 via-accent/5 to-transparent',
    border: 'border-accent/20 hover:border-accent/40',
    iconBg: 'bg-accent/20',
    iconColor: 'text-accent',
    textHover: 'group-hover:text-accent',
    shimmer: 'via-accent/10',
  },
  blue: {
    gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
    border: 'border-blue-500/20 hover:border-blue-500/40',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-500',
    textHover: 'group-hover:text-blue-500',
    shimmer: 'via-blue-500/10',
  },
  green: {
    gradient: 'from-green-500/10 via-green-500/5 to-transparent',
    border: 'border-green-500/20 hover:border-green-500/40',
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-500',
    textHover: 'group-hover:text-green-500',
    shimmer: 'via-green-500/10',
  },
  purple: {
    gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
    border: 'border-purple-500/20 hover:border-purple-500/40',
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-500',
    textHover: 'group-hover:text-purple-500',
    shimmer: 'via-purple-500/10',
  },
  orange: {
    gradient: 'from-orange-500/10 via-orange-500/5 to-transparent',
    border: 'border-orange-500/20 hover:border-orange-500/40',
    iconBg: 'bg-orange-500/20',
    iconColor: 'text-orange-500',
    textHover: 'group-hover:text-orange-500',
    shimmer: 'via-orange-500/10',
  },
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  variant = 'primary',
  className,
  trend,
}) => {
  const styles = variantStyles[variant]

  return (
    <Card
      className={cn(
        'relative overflow-hidden bg-gradient-to-br transition-all duration-300 shadow-sm hover:shadow-md group',
        styles.gradient,
        styles.border,
        className
      )}
    >
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-r from-transparent to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000',
          styles.shimmer
        )}
      />

      <CardContent className="relative pl-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300',
              styles.iconBg
            )}
          >
            <Icon className={cn('h-4.5 w-4.5', styles.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span
                className={cn(
                  'text-xl font-bold text-foreground transition-colors duration-300 leading-none',
                  styles.textHover
                )}
              >
                {value}
              </span>
              <span className="text-sm font-medium text-foreground">{title}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
          {trend && (
            <span
              className={cn(
                'text-xs font-semibold shrink-0',
                trend.value > 0
                  ? 'text-green-500'
                  : trend.value < 0
                    ? 'text-red-500'
                    : 'text-muted-foreground'
              )}
            >
              {trend.value > 0 ? '+' : ''}
              {trend.value}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default StatCard
