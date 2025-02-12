"use client";

import * as React from "react";
import { Trash2, Edit, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HashtagItem } from "@/src/types";

interface EditableHashtagItemProps {
  item: HashtagItem;
  onUpdate: (updatedItem: HashtagItem) => void;
  onDelete: (item: HashtagItem) => void;
}

export function EditableHashtagItem({
  item,
  onUpdate,
  onDelete,
}: EditableHashtagItemProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedValue, setEditedValue] = React.useState(item.current);

  const handleEdit = () => {
    if (isEditing) {
      onUpdate({ ...item, current: editedValue });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setEditedValue(item.current);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center mb-2 w-full">
      {isEditing ? (
        <Input
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          className="mr-2 bg-zinc-800 text-white flex-grow"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleEdit();
            }
          }}
        />
      ) : (
        <div className="w-[280px] mr-2">
          <span className="truncate block w-full">{item.current}</span>
        </div>
      )}
      <div className="flex gap-1 ml-auto">
        <Button
          onClick={handleEdit}
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
        >
          {isEditing ? (
            <Check className="h-4 w-4" />
          ) : (
            <Edit className="h-4 w-4" />
          )}
        </Button>
        {isEditing ? (
          <Button
            onClick={handleCancel}
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={() => onDelete(item)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
