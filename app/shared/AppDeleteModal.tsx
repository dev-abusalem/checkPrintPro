import React from 'react'
import {
   DialogClose,
 
} from "@/components/ui/dialog"
import { Trash2 } from 'lucide-react'
interface AppDeleteModalProps{
  text?: string
  onClick:()=>void
}
const AppDeleteModal = ({onClick,text}:AppDeleteModalProps)=>{
  return(
     
       <div className="relative p-4 text-center bg-white rounded-lg  dark:bg-gray-800 sm:p-5">
            
            <Trash2 className="mx-auto mb-4 text-red-400 w-14 h-14 dark:text-gray-200" />
            <p className="mb-4 text-gray-900 dark:text-gray-300">{text ? text : "Are you sure you want to delete this item?"}</p>
            <div className="flex justify-center items-center space-x-4">
                <DialogClose data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 cursor-pointer dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                    No, cancel
                </DialogClose>
                <button onClick={onClick} type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 cursor-pointer focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
                    Yes, I&apos;m sure
                </button>
            </div>
        </div>
   
    
  )
}
export default AppDeleteModal