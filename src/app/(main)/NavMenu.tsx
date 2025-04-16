"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import UserAvatar from "@/components/UserAvatar";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Substations",
    href: "/substations",
    description: "You can see the substations by filtering on this page.",
  },
  {
    title: "Add Substations",
    href: "/substations/add",
    description:
      "This page for creating new substation which is build at Azerbaijan ",
  },
  {
    title: "TMS",
    href: "/",
    description: "You can see the tms by filtering on this page.",
  },
  {
    title: "Add TMS",
    href: "/tm/add",
    description:
      "This page is for creating a new TM, which is linked with some substations. ",
  },

  {
    title: "Subscribers",
    href: "/subscriber",
    description: "You can see the subscribers by filtering on this page.",
  },
  {
    title: "Add Subscriber",
    href: "/subscriber/add",
    description:
      "This page is for adding a new subscriber, which is linked with some tm appartment. ",
  },
];

export function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-secondary">
            Primary
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 rounded-2xl p-4 shadow-sm backdrop-blur-md md:w-[400px] lg:w-[550px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col items-center justify-center rounded-2xl border border-muted-foreground/40 bg-secondary/40 p-6 no-underline outline-none backdrop-blur-md focus:shadow-md"
                    href="/"
                  >
                    <UserAvatar
                      className="bg-secondary/40"
                      avatarUrl={"/assets/withoutBGAzerisiq.png"}
                      size={80}
                    />
                    <div className="mb-2 mt-4 text-lg font-medium text-primary">
                      AzerIshiq Panel
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      This panel is designed for the employees of Azerishig.
                      Here, you can access real-time information about the
                      Azerbaijani electricity network
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/roles" title="Roles">
                This panel allows Azerİshig employees to monitor the Azerbaijani
                electricity network and manage operational tasks efficiently.
              </ListItem>
              <ListItem href="/about" title="About">
                Azerİshig is a leading company in Azerbaijan, dedicated to
                managing and optimizing the country’s electricity network. With
                a focus on providing reliable and sustainable power
                distribution, AzeriSig plays a vital role in ensuring the
                efficient operation of the national electricity grid.
              </ListItem>
              <ListItem href="/engineer" title="Engineers">
                This site is developed using .NET for backend services and
                Next.js for the frontend, ensuring a fast, scalable, and
                responsive user experience. It integrates modern web
                technologies to deliver real-time data and seamless interactions
                for monitoring the Azerbaijani electricity network
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-secondary">
            Pages
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 rounded-xl p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/terms-of-use" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} bg-secondary transition-all hover:bg-card`}
            >
              Terms of use{" "}
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
