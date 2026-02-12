"use client"

import React from 'react'
import { Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ProfileForm() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-slate-100">
              <AvatarImage src="https://github.com/shadcn.png" alt="Emmanuel Dorime" />
              <AvatarFallback>ED</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-[#3b82f6] rounded-full p-1.5 border-2 border-white shadow-sm">
              <div className="text-[10px] font-bold text-white leading-none">M</div>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Emmanuel Dorime</h1>
            <p className="text-sm text-slate-400 font-medium">emma123@gmail.com</p>
          </div>
        </div>

        {/* Shadcn Modal for Edit */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" className="bg-[#1e293b] text-white hover:bg-slate-800 px-8 h-11">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" defaultValue="Emmanuel Dorime" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" defaultValue="emma123@gmail.com" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <FormGroup label="Full Name" />
        <FormGroup label="Full Name" />
        
        <SelectGroup label="Gender" />
        <SelectGroup label="Country" />
        
        <SelectGroup label="Language" />
        <SelectGroup label="Time Zone" />
      </div>

      {/* Email Section */}
      <div className="mt-12 space-y-5">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">My email Address</h3>
        
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-2.5 rounded-xl">
            <Mail className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-700">emma123@gmail.com</span>
            <span className="text-xs text-slate-400">1 month ago</span>
          </div>
        </div>

        <Button 
          variant="ghost" 
          className="text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 px-6 h-11 font-semibold rounded-xl"
        >
          + Add Email Address
        </Button>
      </div>
    </div>
  )
}

/** * Reusable Components to ensure identical widths and styling
 */

const FormGroup = ({ label }) => (
  <div className="flex flex-col space-y-3 w-full">
    <Label className="text-slate-600 font-semibold">{label}</Label>
    <Input 
      placeholder="Your First Name" 
      className="bg-[#F9F9F9] border-none h-14 w-full focus-visible:ring-1 focus-visible:ring-slate-200 placeholder:text-slate-300" 
    />
  </div>
)

const SelectGroup = ({ label }) => (
  <div className="flex flex-col space-y-3 w-full">
    <Label className="text-slate-600 font-semibold">{label}</Label>
    <Select>
      <SelectTrigger className="bg-slate-50/50 border-none h-14 w-full focus:ring-1 focus:ring-slate-200 text-slate-300">
        <SelectValue placeholder="Your First Name" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="opt1">Option 1</SelectItem>
        <SelectItem value="opt2">Option 2</SelectItem>
      </SelectContent>
    </Select>
  </div>
)