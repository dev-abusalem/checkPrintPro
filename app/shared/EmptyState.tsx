import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

interface EmptyStateProps {
    addNewUrl?: string
    title: string
    description: string
    isAddButton?: boolean
    Icon: any
    buttonText?: string
}
const EmptyState = ({addNewUrl, title, description, isAddButton,Icon,buttonText}:EmptyStateProps) => {
    const router = useRouter()

    const onAddNew = () => {
        if(addNewUrl){
            router.push(addNewUrl)
        }
    }
  return (
      <div className="text-center py-8">
        <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {
          isAddButton && <Button onClick={onAddNew} className="bg-emerald-600 cursor-pointer hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
         {buttonText ? buttonText : "Add New"}
        </Button>
        }
      </div>
    )
}

export default EmptyState