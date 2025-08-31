'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { usePerformance } from '@/hooks/usePerformance'

interface PerformanceMonitorProps {
  className?: string
  showDetails?: boolean
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  theme?: 'light' | 'dark' | 'auto'
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  className,
  showDetails = false,
  position = 'top-right',
  theme = 'auto'
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { metrics, isLowEnd, getOptimizationRecommendations, getPerformanceSettings } = usePerformance()

  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }

  // Performance status color
  const getStatusColor = () => {
    if (metrics.fps < 30) return 'text-red-500'
    if (metrics.fps < 45) return 'text-yellow-500'
    return 'text-green-500'
  }

  // Memory usage percentage
  const getMemoryPercentage = () => {
    if (!metrics.memoryUsage) return null
    // Estimate total memory (this is approximate)
    const estimatedTotal = 8 // Assume 8GB for most devices
    return Math.round((metrics.memoryUsage / estimatedTotal) * 100)
  }

  // Connection speed indicator
  const getConnectionIcon = () => {
    if (!metrics.connectionSpeed) return '🌐'
    switch (metrics.connectionSpeed) {
      case 'slow-2g': return '🐌'
      case '2g': return '🐌'
      case '3g': return '🚶'
      case '4g': return '🏃'
      default: return '🚀'
    }
  }

  // Toggle visibility
  const toggleVisibility = () => setIsVisible(!isVisible)
  const toggleExpanded = () => setIsExpanded(!isExpanded)

  // Auto-hide after 5 seconds of inactivity
  useEffect(() => {
    if (isVisible && !isExpanded) {
      const timer = setTimeout(() => setIsVisible(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, isExpanded])

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className={cn(
          'fixed z-50 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background/90 transition-all duration-200',
          positionClasses[position],
          className
        )}
        title="Show Performance Monitor"
      >
        📊
      </button>
    )
  }

  return (
    <div
      className={cn(
        'fixed z-50 bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-xl transition-all duration-300',
        positionClasses[position],
        isExpanded ? 'w-80' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center space-x-2">
          <span className="text-lg">📊</span>
          <span className="font-medium text-sm">Performance</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={toggleExpanded}
            className="p-1 hover:bg-muted rounded transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '−' : '+'}
          </button>
          <button
            onClick={toggleVisibility}
            className="p-1 hover:bg-muted rounded transition-colors"
            title="Close"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        {/* FPS */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">FPS:</span>
          <span className={cn('font-mono text-sm font-medium', getStatusColor())}>
            {metrics.fps}
          </span>
        </div>

        {/* Memory */}
        {metrics.memoryUsage && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Memory:</span>
            <span className="font-mono text-sm font-medium">
              {metrics.memoryUsage.toFixed(1)}GB
              {getMemoryPercentage() && ` (${getMemoryPercentage()}%)`}
            </span>
          </div>
        )}

        {/* Connection */}
        {metrics.connectionSpeed && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Connection:</span>
            <span className="font-mono text-sm font-medium flex items-center space-x-1">
              <span>{getConnectionIcon()}</span>
              <span>{metrics.connectionSpeed}</span>
            </span>
          </div>
        )}

        {/* Device Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Device:</span>
          <span className={cn('text-sm font-medium', isLowEnd ? 'text-yellow-500' : 'text-green-500')}>
            {isLowEnd ? 'Low-end' : 'High-end'}
          </span>
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Motion:</span>
          <span className={cn('text-sm font-medium', metrics.reducedMotion ? 'text-orange-500' : 'text-green-500')}>
            {metrics.reducedMotion ? 'Reduced' : 'Normal'}
          </span>
        </div>

        {/* Performance Settings */}
        {isExpanded && (
          <div className="pt-3 border-t border-border">
            <h4 className="text-sm font-medium mb-2">Current Settings:</h4>
            <div className="space-y-2 text-xs">
              {Object.entries(getPerformanceSettings()).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span className="font-mono">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {isExpanded && (
          <div className="pt-3 border-t border-border">
            <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {getOptimizationRecommendations().map((rec, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Actions */}
        {isExpanded && (
          <div className="pt-3 border-t border-border">
            <h4 className="text-sm font-medium mb-2">Quick Actions:</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => window.location.reload()}
                className="px-2 py-1 text-xs bg-primary/10 text-primary rounded border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => window.location.href = '/?performance=low'}
                className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded border border-secondary/20 hover:bg-secondary/20 transition-colors"
              >
                Force Low Mode
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PerformanceMonitor