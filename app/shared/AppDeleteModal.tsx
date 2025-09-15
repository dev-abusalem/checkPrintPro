import React from 'react'
 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,   DialogClose,

} from "@/components/ui/dialog"
import { Trash2 } from 'lucide-react'
interface AppDeleteModalProps{
  text?: string
  onClick:()=>void
  loading?:boolean
  children:React.ReactNode
}
const AppDeleteModal = ({onClick,text,loading,children}:AppDeleteModalProps)=>{
  return(
     <Dialog>
  <DialogTrigger className='w-full'>{children}</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle></DialogTitle>
       <div className="relative p-4 text-center bg-white rounded-lg  dark:bg-gray-800 sm:p-5">
            
            <Trash2 className="mx-auto mb-4 text-red-400 w-14 h-14 dark:text-gray-200" />
            <p className="mb-4 text-gray-900 dark:text-gray-300">{text ? text : "Are you sure you want to delete this item?"}</p>
            <div className="flex justify-center items-center space-x-4">
                <DialogClose data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-green-500 bg-green-50 rounded border border-green-200 hover:bg-green-100 cursor-pointer ">
                    No, cancel
                </DialogClose>
                <button disabled={loading} onClick={onClick} type="submit" className={`py-2 px-3 text-sm font-medium text-center text-white ${loading && "opacity-50"} bg-red-600 rounded hover:bg-red-700 cursor-pointer`}>
                    {
                      loading ? "Deleting..." : "Yes, Im sure"
                    }
                </button>
            </div>
        </div>
    </DialogHeader>
  </DialogContent>
</Dialog>
      
   
    
  )
}
export default AppDeleteModal