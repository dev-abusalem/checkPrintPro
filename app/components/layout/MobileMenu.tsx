import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Button } from '@/components/ui/button'
const MobileMenu = () => {
  return (
    <Sheet >
  <SheetTrigger asChild>
    <Button variant='outline' size='icon'>
      <Menu />
     </Button>
  </SheetTrigger>
  <SheetContent side='left'>
    <SheetHeader>
      <SheetTitle></SheetTitle>
      <SheetDescription>
        <Sidebar />
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
  )
}

export default MobileMenu