"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import logo from "@/assets/logo.png"
import { Globe, Mic, Sailboat } from "lucide-react"
import { WindowControls, WindowTitlebar } from "tauri-controls"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"

import { Dialog, DialogTrigger } from "./ui/dialog"

export function Menu() {
  const closeWindow = useCallback(async () => {
    const { appWindow } = await import("@tauri-apps/plugin-window")
    appWindow.close()
  }, [])

  return (
    <WindowTitlebar
    // controlsOrder="left"
    // className="pl-0"
    // windowControlsProps={{ platform: "windows", justify: false }}
    >
      <Menubar className="rounded-none border-b border-none pl-2 lg:pl-3">
        <MenubarMenu>
          {/* App Logo */}
          <div className="inline-flex h-fit w-fit items-center text-cyan-500">
            {usePathname() === "/" || usePathname() === "/examples/music" ? (
              <Image src={logo} alt="logo" width={20} height={20} />
            ) : (
              <Sailboat className="h-5 w-5" />
            )}
          </div>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="font-bold">Diary</MenubarTrigger>
          <Dialog modal={false}>
            <MenubarContent>
              <DialogTrigger asChild>
                <MenubarItem>About App</MenubarItem>
              </DialogTrigger>

              <MenubarSeparator />
              <MenubarItem>
                Preferences... <MenubarShortcut>⌘,</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </Dialog>
        </MenubarMenu>
      </Menubar>
    </WindowTitlebar>
  )
}
