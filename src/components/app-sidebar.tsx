"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { RowsIcon, TerminalIcon } from "@phosphor-icons/react"


const data = {
  teams: [
    {
      name: "App",
      logo: <RowsIcon />,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Users",
      url: "#",
      icon: <TerminalIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<{
    name: string
    email: string
    avatar: string
  } | null>(null)

  React.useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const res = await fetch("http://localhost:5188/api/Auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) return

        const data = await res.json()
        setUser({
          name: data.username,
          email: data.email,
          avatar: "/avatars/shadcn.jpg",
        })
      } catch (err) {
        console.error("Failed to fetch user:", err)
      }
    }

    fetchUser()
  }, [])

  const defaultUser = {
    name: "Guest",
    email: "Not logged in",
    avatar: "/avatars/default.jpg",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
         <NavUser user={user ?? defaultUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}