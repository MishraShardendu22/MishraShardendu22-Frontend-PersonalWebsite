'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProjectDetail } from '@/data/types.data'
import { projectsAPI } from '@/util/apiResponse.util'
import { FolderKanban, Loader2, AlertCircle, GripVertical, Save } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="group relative overflow-hidden border-2 border-border/50 hover:border-secondary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-2 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm rounded-2xl"
    >
      <CardHeader className="bg-gradient-to-r from-secondary/10 to-card pb-4">
        <div className="flex items-start justify-between gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-secondary/20 rounded"
          >
            <GripVertical className="h-5 w-5 text-secondary" />
          </div>
          <CardTitle className="text-xl font-semibold text-secondary line-clamp-2 flex-1">
            {project.project_title}
          </CardTitle>
          <Badge
            variant="outline"
            className="shrink-0 bg-secondary/10 text-secondary border-secondary/20"
          >
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
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

      console.log(`Updating order for ${updateData.length} projects...`, updateData)
      await projectsAPI.updateOrder(updateData)
      console.log('Order update successful')

      // Update the original order map with new values
      const newOrderMap = new Map(originalOrder)
      changedItems.forEach((item) => {
        newOrderMap.set(item.id, item.newOrder)
      })
      setOriginalOrder(newOrderMap)

      // Clear changed items since they've been saved
      setChangedItems([])

      router.refresh()
    } catch (error: any) {
      console.error('Error updating order:', error)

      // Enhanced error handling with specific messages
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    setAllProjects((items) => {
      const oldIndex = items.findIndex((item) => item.project_id === active.id)
      const newIndex = items.findIndex((item) => item.project_id === over.id)

      const newItems = arrayMove(items, oldIndex, newIndex)

      // Update the order field for each project and track changes
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        order: index + 1, // Start from 1 instead of 0
      }))

      // Calculate what actually changed compared to original order
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
      console.log('Changed items:', changes)

      return updatedItems
    })
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-secondary animate-spin mb-4" />
        <p className="text-lg text-foreground">Loading projects...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-heading text-foreground">Oops! Something went wrong</h2>
          <p className="text-foreground text-lg">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-4 animate-fade-in">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 border-2 border-secondary/30">
            <FolderKanban className="h-12 w-12 text-secondary" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent leading-tight">
          Kanban Board
        </h1>
        <p className="text-base text-foreground">Organize and manage your project workflow</p>
      </div>

      {changedItems.length > 0 && (
        <div className="flex justify-center">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes ({changedItems.length})
              </>
            )}
          </Button>
        </div>
      )}

      {allprojects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
          <FolderKanban className="mx-auto h-16 w-16 text-foreground mb-4" />
          <h3 className="text-2xl font-semibold text-foreground mb-2">No projects yet</h3>
          <p className="text-lg text-foreground mb-6">
            Your kanban board is empty. Projects will appear here once created.
          </p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all">All Projects ({allprojects.length})</TabsTrigger>
            <TabsTrigger value="changed">Changed ({changedItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={allprojects.map((p) => p.project_id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
                  {allprojects.map((project) => (
                    <SortableCard key={project.project_id} project={project} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </TabsContent>

          <TabsContent value="changed" className="mt-6">
            {changedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
                <AlertCircle className="mx-auto h-16 w-16 text-foreground mb-4" />
                <h3 className="text-2xl font-semibold text-foreground mb-2">No changes yet</h3>
                <p className="text-lg text-foreground">Drag and drop projects to reorder them</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary/10 border-b border-border">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                        Project ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-secondary">
                        Title
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-secondary">
                        Old Order
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-secondary">
                        New Order
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {changedItems.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`border-b border-border hover:bg-secondary/5 transition-colors ${
                          index % 2 === 0 ? 'bg-card/50' : 'bg-card'
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-foreground font-mono">{item.id}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{item.title}</td>
                        <td className="px-6 py-4 text-center">
                          <Badge
                            variant="outline"
                            className="bg-destructive/10 text-destructive border-destructive/20"
                          >
                            #{item.oldOrder}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge
                            variant="outline"
                            className="bg-secondary/10 text-secondary border-secondary/20"
                          >
                            #{item.newOrder}
                          </Badge>
                        </td>
                      </tr>
                    ))}
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
