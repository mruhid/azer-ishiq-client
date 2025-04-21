"use client";

import {
  Building2,
  Cable,
  ChevronDown,
  UserCheck2,
  UserCheck2Icon,
  UserCircle2Icon,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import UserAvatar from "./UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ScrollArea } from "./ui/scroll-area";

type MenuItem = {
  name: string;
  src: string | null;
  icon: React.ElementType | null;
};

type MenuProps = {
  name: string;
  src: string | null;
  icon: React.ElementType | null;
  altMenu: MenuItem[] | null;
};

export default function SideBar() {
  const { user } = useSession();
  const isUser = user.roles.length == 1 && user.roles[0] === "User";
  const sidebarEquipment: MenuProps[] = !isUser
    ? [
        {
          name: "Subscribers",
          src: null,
          icon: UserCheck2,
          altMenu: [
            {
              name: "All Subscriber",
              src: "/subscriber",
              icon: null,
            },
            {
              name: "Add Subscriber",
              src: "/subscriber/add",
              icon: null,
            },
          ],
        },
        {
          name: "TMS",
          src: null,
          icon: Cable,
          altMenu: [
            {
              name: "All Transformers",
              src: "/",
              icon: null,
            },
            {
              name: "Add Transformer",
              src: "/tm/add",
              icon: null,
            },
          ],
        },
        {
          name: "Substations",
          src: null,
          icon: Building2,
          altMenu: [
            {
              name: "All Substations",
              src: "/substations",
              icon: null,
            },
            {
              name: "Add Substations",
              src: "/substations/add",
              icon: null,
            },
          ],
        },
        {
          name: "User Management",
          src: "/users-management",
          icon: UserCheck2Icon,
          altMenu: null,
        },
        {
          name: "Operation Logs",
          src: "/operation-logs",
          icon: UserCircle2Icon,
          altMenu: null,
        },
      ]
    : [
        {
          name: "Subscribers",
          src: null,
          icon: UserCheck2,
          altMenu: [
            {
              name: "All Subscriber",
              src: "/subscriber",
              icon: null,
            },
          ],
        },
        {
          name: "TMS",
          src: null,
          icon: Cable,
          altMenu: [
            {
              name: "All Transformers",
              src: "/",
              icon: null,
            },
          ],
        },
        {
          name: "Substations",
          src: null,
          icon: Building2,
          altMenu: [
            {
              name: "All Substations",
              src: "/substations",
              icon: null,
            },
          ],
        },
      ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="item-center flex flex-col justify-center gap-y-2 px-2 text-xl font-bold">
          <div className="mx-auto">
            <UserAvatar size={50} avatarUrl={""} />
          </div>
          <p className="mx-auto text-sm">
            {user ? user.userName : "Unauthorized user"}
          </p>
        </div>
      </SidebarHeader>
      <ScrollArea className="h-[700px]">
        <SidebarContent className="mt-5 flex w-full flex-col pr-3">
          <SidebarGroupContent className="">
            <h3 className="mb-2 ml-3 text-start text-sm text-blue-200">
              Equipment
            </h3>
            <SidebarMenu>
              {sidebarEquipment.map((menuItem) =>
                menuItem.altMenu ? (
                  <Collapsible
                    key={menuItem.name}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <div className="flex w-full items-center justify-between rounded-xl px-2 py-1 transition-all hover:bg-white hover:text-primary">
                        <div className="flex items-center justify-center">
                          {menuItem.icon && (
                            <menuItem.icon size={24} className="mr-2" />
                          )}
                          <h4 className="text-sm font-semibold">
                            {menuItem.name}
                          </h4>
                        </div>

                        <CollapsibleTrigger asChild>
                          <Button
                            className="hover:bg-white hover:text-primary"
                            variant="ghost"
                            size="icon"
                          >
                            <ChevronDown className="h-4 w-4 transition-transform duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-180" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>

                      <CollapsibleContent className="overflow-hidden rounded-sm p-2 transition-[height] duration-300 ease-in-out data-[state=closed]:h-0 data-[state=open]:h-auto">
                        {menuItem.altMenu.map((a, i) => (
                          <Link key={i} href={a.src || "/"}>
                            <div className="cursor-pointer rounded-xl p-2 text-left font-mono text-sm hover:bg-white hover:text-primary">
                              <h2>&gt; {a.name}</h2>
                            </div>
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <Link
                    key={menuItem.name}
                    href={menuItem.src ? menuItem.src : "/"}
                  >
                    <div className="flex w-full cursor-pointer items-center justify-between rounded-xl px-2 py-1 transition-all hover:bg-white hover:text-primary">
                      <div className="flex h-10 w-full items-center justify-center">
                        {menuItem.icon && (
                          <menuItem.icon size={24} className="mr-2" />
                        )}
                        <h4 className="w-full text-sm font-semibold">
                          {menuItem.name}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarContent>
      </ScrollArea>

      {/* Sidebar Footer */}
      <SidebarFooter className="mt-auto px-4 py-6"></SidebarFooter>
    </Sidebar>
  );
}
