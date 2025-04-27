"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Keyboard, SkipBack, Pause, SkipForward, Volume2, Repeat } from "lucide-react"

export function KeyboardShortcutsModal() {
  const [open, setOpen] = useState(false)

  const shortcuts = [
    { action: "Light/Dark mode", keys: ["Alt", "M"], icon: <Keyboard className="h-4 w-4" /> },
    { action: "Skip back", keys: ["Alt", "J"], icon: <SkipBack className="h-4 w-4" /> },
    { action: "Pause", keys: ["Alt", "K"], icon: <Pause className="h-4 w-4" /> },
    { action: "Skip forward", keys: ["Alt", "L"], icon: <SkipForward className="h-4 w-4" /> },
    { action: "Mute", keys: ["Alt", "O"], icon: <Volume2 className="h-4 w-4" /> },
    { action: "Repeat", keys: ["Alt", "Shift", "P"], icon: <Repeat className="h-4 w-4" /> },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <p className="flex items-center">
          <Keyboard className="mr-2 h-4 w-4" />
          <span>Keyboard Shortcuts</span>
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>Use these keyboard shortcuts for quick navigation and control.</DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Shortcut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shortcuts.map((shortcut) => (
              <TableRow key={shortcut.action}>
                <TableCell className="flex items-center gap-2">
                  {shortcut.icon}
                  <span>{shortcut.action}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, index) => (
                      <span key={index} className="flex items-center">
                        <kbd className="pointer-events-none inline-flex h-5 select-none rounded bg-muted px-1.5 font-mono text-[12px] text-muted-foreground">
                          {key}
                        </kbd>
                        {index < shortcut.keys.length - 1 && <span className="mx-1">+</span>}
                      </span>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}

