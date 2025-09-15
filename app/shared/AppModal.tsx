import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
interface AppModalProps{
  children: React.ReactNode
  component: React.ReactNode
}
const AppModal = ({ children, component}:AppModalProps) => {
  return (
     <Dialog>
  <DialogTrigger className='w-full'>{children}</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle></DialogTitle>
      <div>{component}</div>
    </DialogHeader>
  </DialogContent>
</Dialog>
   )
}

export default AppModal