"use client"

import * as React from "react"
import { Trash2, Edit, Check, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (updatedTopics: string[], updatedHashtags: string[]) => void
  topics: string[]
  hashtags: string[]
}

interface EditableItemProps {
  item: string
  onEdit: (oldValue: string, newValue: string) => void
  onDelete: (value: string) => void
  canDelete?: boolean
}

function EditableItem({ item, onEdit, onDelete, canDelete = true }: EditableItemProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedValue, setEditedValue] = React.useState(item)

  const handleEdit = () => {
    if (isEditing) {
      onEdit(item, editedValue)
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    setEditedValue(item)
    setIsEditing(false)
  }

  return (
    <div className="flex items-center mb-2 w-full">
      {isEditing ? (
        <Input
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          className="mr-2 bg-zinc-800 text-white flex-grow"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleEdit()
            }
          }}
        />
      ) : (
        <div className="w-[280px] mr-2">
          <span className="truncate block w-full">{item}</span>
        </div>
      )}
      <div className="flex gap-1 ml-auto">
        <Button onClick={handleEdit} variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
          {isEditing ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
        </Button>
        {isEditing ? (
          <Button onClick={handleCancel} variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
            <X className="h-4 w-4" />
          </Button>
        ) : (
          canDelete && (
            <Button onClick={() => onDelete(item)} variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
              <Trash2 className="h-4 w-4" />
            </Button>
          )
        )}
      </div>
    </div>
  )
}

export function EditModal({ isOpen, onClose, onSave, topics, hashtags }: EditModalProps) {
  const [localTopics, setLocalTopics] = React.useState(topics)
  const [localHashtags, setLocalHashtags] = React.useState(hashtags)
  const [newTopic, setNewTopic] = React.useState("")
  const [newHashtag, setNewHashtag] = React.useState("")

  React.useEffect(() => {
    setLocalTopics(topics)
    setLocalHashtags(hashtags)
  }, [topics, hashtags])

  const handleSave = () => {
    onSave(localTopics, localHashtags)
  }

  const handleClose = () => {
    setLocalTopics(topics)
    setLocalHashtags(hashtags)
    onClose()
  }

  const handleAddTopic = () => {
    if (newTopic && !localTopics.includes(newTopic)) {
      setLocalTopics([...localTopics, newTopic])
      setNewTopic("")
    }
  }

  const handleAddHashtag = () => {
    if (newHashtag && !localHashtags.includes(newHashtag)) {
      setLocalHashtags([...localHashtags, newHashtag])
      setNewHashtag("")
    }
  }

  const handleEditTopic = (oldTopic: string, newTopic: string) => {
    setLocalTopics((prevTopics) => prevTopics.map((topic) => (topic === oldTopic ? newTopic : topic)))
  }

  const handleEditHashtag = (oldHashtag: string, newHashtag: string) => {
    setLocalHashtags((prevHashtags) => prevHashtags.map((hashtag) => (hashtag === oldHashtag ? newHashtag : hashtag)))
  }

  const handleDeleteTopic = (topic: string) => {
    setLocalTopics(localTopics.filter((t) => t !== topic))
  }

  const handleDeleteHashtag = (hashtag: string) => {
    setLocalHashtags(localHashtags.filter((h) => h !== hashtag))
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[800px] max-w-[800px] bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>Edit Topics and Hashtags</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold">Topics</h3>
            <div className="mb-2">
              <Input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddTopic()
                  }
                }}
                placeholder="Add new topic and press Enter"
                className="bg-zinc-800 text-white"
              />
            </div>
            <ScrollArea className="h-[300px] pr-4" type="always">
              {localTopics.map((topic) => (
                <EditableItem
                  key={topic}
                  item={topic}
                  onEdit={handleEditTopic}
                  onDelete={handleDeleteTopic}
                  canDelete={false}
                />
              ))}
            </ScrollArea>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Hashtags</h3>
            <div className="mb-2">
              <Input
                value={newHashtag}
                onChange={(e) => setNewHashtag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddHashtag()
                  }
                }}
                placeholder="Add new hashtag and press Enter"
                className="bg-zinc-800 text-white"
              />
            </div>
            <ScrollArea className="h-[300px] pr-4" type="always">
              {localHashtags.map((hashtag) => (
                <EditableItem key={hashtag} item={hashtag} onEdit={handleEditHashtag} onDelete={handleDeleteHashtag} />
              ))}
            </ScrollArea>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleClose}
            variant="outline"
            className="bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-white text-zinc-900 hover:bg-zinc-200 border border-zinc-300">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

