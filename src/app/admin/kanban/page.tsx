'use client'

import {
  useSensor,
  useSensors,
  DndContext,
  DragOverlay,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  DragStartEvent,
  KeyboardSensor,
} from '@dnd-kit/core'
import {
  arrayMove,
  useSortable,
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProjectDetail } from '@/data/types.data'
import { projectsAPI } from '@/util/apiResponse.util'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Save,
  Package,
  Loader2,
  TrendingUp,
  AlertCircle,
  GripVertical,
  CheckCircle2,
  TrendingDown,
  FolderKanban,
} from 'lucide-react'

interface SortableCardProps {
  project: ProjectDetail
}

const SortableCard = ({ project }: SortableCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.project_id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`group relative border bg-card transition-all duration-200 ${
        isDragging ? 'opacity-50 shadow-lg scale-[0.98]' : 'hover:shadow-md hover:border-primary/30'
      }`}
    >
      <CardHeader className="p-4">
        <div className="flex items-start gap-3">
          <div
            {...attributes}
            {...listeners}
            className="mt-0.5 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted/50 transition-colors"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-medium text-foreground line-clamp-2 leading-snug">
              {project.project_title}
            </CardTitle>
          </div>

          <Badge variant="secondary" className="shrink-0 font-mono text-xs h-6 px-2">
            #{project.order}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  )
}

const KanbanPage = () => {
  const router = useRouter()
  const [allprojects, setAllProjects] = useState<ProjectDetail[]>([])
  const [originalOrder, setOriginalOrder] = useState<Map<string, number>>(new Map())
  const [changedItems, setChangedItems] = useState<
    Array<{
      id: string
      title: string
      oldOrder: number
      newOrder: number
    }>
  >([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const projectsRes = await projectsAPI.getAllProjectsKanban()
        const projects = Array.isArray(projectsRes.data) ? projectsRes.data : []
        const sortedProjects = projects.sort((a, b) => (a.order || 0) - (b.order || 0))
        setAllProjects(sortedProjects)
        const orderMap = new Map<string, number>()
        sortedProjects.forEach((project) => {
          orderMap.set(project.project_id, project.order || 0)
        })
        setOriginalOrder(orderMap)
        setError('')
      } catch (error) {
        setError('Failed to load projects. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const handleSave = async () => {
    if (changedItems.length === 0) return

    try {
      setSaving(true)
      const updateData = changedItems.map((item) => ({
        project_id: item.id,
        order: item.newOrder,
      }))
      await projectsAPI.updateOrder(updateData)

      const newOrderMap = new Map(originalOrder)
      changedItems.forEach((item) => {
        newOrderMap.set(item.id, item.newOrder)
      })
      setOriginalOrder(newOrderMap)
      setChangedItems([])

      router.refresh()
    } catch (error: any) {
      console.error('Error updating order:', error)
      let errorMessage = 'Failed to save changes. Please try again.'

      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
        errorMessage = 'Connection error. Check your internet connection and try again.'
      } else if (error.response?.status === 408) {
        errorMessage =
          'Request timed out. The update is taking longer than expected. Please try with fewer items or try again later.'
      } else if (error.response?.status === 502) {
        errorMessage = 'Backend service is temporarily unavailable. Please try again in a moment.'
      } else if (error.response?.status === 503) {
        errorMessage = 'Backend service is currently down. Please try again later.'
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Our team has been notified. Please try again later.'
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication expired. Please log in again.'
      } else if (error.response?.status === 403) {
        errorMessage = 'Permission denied. You may not have access to this operation.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`
      }

      setError(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) return

    setAllProjects((items) => {
      const oldIndex = items.findIndex((item) => item.project_id === active.id)
      const newIndex = items.findIndex((item) => item.project_id === over.id)

      const newItems = arrayMove(items, oldIndex, newIndex)

      const updatedItems = newItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }))

      const changes: Array<{ id: string; title: string; oldOrder: number; newOrder: number }> = []
      updatedItems.forEach((item) => {
        const originalOrderValue = originalOrder.get(item.project_id)
        if (originalOrderValue !== undefined && originalOrderValue !== item.order) {
          changes.push({
            id: item.project_id,
            title: item.project_title,
            oldOrder: originalOrderValue,
            newOrder: item.order,
          })
        }
      })

      setChangedItems(changes)
      return updatedItems
    })
  }

  const activeProject = allprojects.find((p) => p.project_id === activeId)

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <div className="space-y-1 text-center">
          <p className="text-base font-medium text-foreground">Loading Projects</p>
          <p className="text-sm text-muted-foreground">Please wait...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-xl font-semibold text-foreground">Error Loading Projects</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="border-b pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <FolderKanban className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground">Project Management</h1>
        </div>
        <p className="text-sm text-muted-foreground ml-14">
          Organize and prioritize your projects using drag and drop
        </p>
      </div>

      {allprojects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-muted/20">
          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">No Projects Found</h3>
          <p className="text-sm text-muted-foreground">Projects will appear here once created</p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-md h-10 bg-muted p-1">
            <TabsTrigger value="all" className="flex-1 text-sm data-[state=active]:bg-background">
              All Projects ({allprojects.length})
            </TabsTrigger>
            <TabsTrigger
              value="changed"
              className="flex-1 text-sm data-[state=active]:bg-background"
            >
              Changes {changedItems.length > 0 && `(${changedItems.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={allprojects.map((p) => p.project_id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {allprojects.map((project) => (
                    <SortableCard key={project.project_id} project={project} />
                  ))}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeProject ? (
                  <Card className="shadow-xl border-primary/50 bg-card">
                    <CardHeader className="p-4">
                      <div className="flex items-start gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <CardTitle className="text-base font-medium text-foreground line-clamp-2 flex-1">
                          {activeProject.project_title}
                        </CardTitle>
                        <Badge variant="secondary" className="font-mono text-xs h-6 px-2">
                          #{activeProject.order}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ) : null}
              </DragOverlay>
            </DndContext>
          </TabsContent>

          <TabsContent value="changed" className="mt-6 space-y-4">
            {changedItems.length > 0 && (
              <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {changedItems.length} {changedItems.length === 1 ? 'project' : 'projects'}{' '}
                      modified
                    </p>
                    <p className="text-xs text-muted-foreground">Click save to apply changes</p>
                  </div>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}

            {changedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border rounded-lg bg-muted/20">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">No Changes</h3>
                <p className="text-sm text-muted-foreground">
                  Reorder projects in the All Projects tab to see changes
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Project Title
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Previous
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        New
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {changedItems.map((item) => {
                      const orderChange = item.newOrder - item.oldOrder
                      const isMovedDown = orderChange > 0

                      return (
                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-foreground truncate max-w-xs">
                                {item.title}
                              </span>
                              <span className="text-xs text-muted-foreground font-mono">
                                ID: {item.id.substring(0, 8)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="outline" className="font-mono text-xs">
                              #{item.oldOrder}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="default" className="font-mono text-xs bg-primary">
                              #{item.newOrder}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {isMovedDown ? (
                                <TrendingDown className="h-3.5 w-3.5 text-orange-500" />
                              ) : (
                                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                              )}
                              <span
                                className={`text-sm font-medium ${
                                  isMovedDown ? 'text-orange-500' : 'text-green-500'
                                }`}
                              >
                                {Math.abs(orderChange)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

export default KanbanPage
