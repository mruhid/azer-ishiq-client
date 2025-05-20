import { Metadata } from "next";
import MessageFeed from "./MessageFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCheck,
  MailCheckIcon,
  MinusCircle,
  PictureInPicture,
} from "lucide-react";
import { validateRequest } from "@/lib/session";
import UnauthorizedPage from "@/components/UnauthorizedPage";
import { ScrollArea } from "@/components/ui/scroll-area";

export const metadata: Metadata = {
  title: "User messages",
};
export default async function Page() {
  const { session } = await validateRequest();
  if (!session) {
    return <UnauthorizedPage />;
  }

  return (
    <div className="w-full px-2">
      <main className="mx-auto w-full max-w-[1000px] space-y-5 rounded-xl border bg-card/50 px-2 py-4">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-semibold text-primary">
            Feedback messages
          </h1>
          <div className="flex items-center justify-center gap-x-1">
            <MailCheckIcon size={40} className="text-primary" />
          </div>
        </div>

        <Tabs defaultValue="default" className="flex flex-col">
          <TabsList className="grid h-20 w-full grid-cols-3 border border-muted-foreground/30 bg-secondary">
            <TabsTrigger
              value="default"
              className="h-16 rounded-none border-b-[3px] border-secondary bg-secondary text-muted-foreground shadow-sm hover:bg-muted-foreground/10 data-[state=active]:border-primary data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-md"
            >
              <PictureInPicture className="mr-4" /> <p>All</p>
            </TabsTrigger>
            <TabsTrigger
              value="read"
              className="h-16 rounded-none border-b-[3px] border-secondary bg-secondary text-muted-foreground shadow-sm hover:bg-muted-foreground/10 data-[state=active]:border-primary data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-md"
            >
              <CheckCheck className="mr-4" /> Already read
            </TabsTrigger>
            <TabsTrigger
              value="noRead"
              className="h-16 rounded-none border-b-[3px] border-secondary bg-secondary text-muted-foreground shadow-sm hover:bg-muted-foreground/10 data-[state=active]:border-primary data-[state=active]:bg-secondary data-[state=active]:text-primary data-[state=active]:shadow-md"
            >
              <MinusCircle className="mr-4" /> Did not read
            </TabsTrigger>
          </TabsList>

          {/* Scrollable Content */}
          <ScrollArea className="h-[300px]">
            <TabsContent value="default">
              <MessageFeed type="default" />
            </TabsContent>
            <TabsContent value="read">
              <MessageFeed type="read" />
            </TabsContent>
            <TabsContent value="noRead">
              <MessageFeed type="noRead" />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </main>
    </div>
  );
}
