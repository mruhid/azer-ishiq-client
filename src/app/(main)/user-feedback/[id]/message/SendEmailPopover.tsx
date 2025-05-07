"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SendEmailPopover({ email }: { email: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="text-md cursor-pointer text-muted-foreground/70 transition-colors duration-200 hover:text-muted-foreground">
            &lt;{email}&gt;
          </p>
        </TooltipTrigger>
        <TooltipContent className="flex w-[270px] items-center justify-center rounded-xl border bg-secondary shadow-lg">
          <div className="mx-auto flex w-full flex-col gap-y-2">
            <div className="flex items-start justify-start gap-x-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                Send email to
              </h2>
              <p className="text-primary">{email}</p>
            </div>

            <a className="w-full" href={`mailto:${email}`}>
              <Button className="w-full rounded-lg border border-transparent bg-primary text-white transition-all duration-300 hover:border-primary hover:bg-white hover:text-primary">
                Send Email
              </Button>
            </a>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
export function CallPhonePopover({ number }: { number: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="text-md cursor-pointer text-muted-foreground/70 transition-colors duration-200 hover:text-muted-foreground">
            &lt;{number}&gt;
          </p>
        </TooltipTrigger>
        <TooltipContent className="flex w-[270px] items-center justify-center rounded-xl border bg-secondary shadow-lg">
          <div className="mx-auto flex w-full flex-col gap-y-2">
            <div className="flex items-start justify-start gap-x-2">
              <h2 className="text-sm font-medium text-muted-foreground">
                Call
              </h2>
              <p className="text-primary">{number}</p>
            </div>

            <a className="w-full" href={`tel:${number}`}>
              <Button className="w-full rounded-lg border border-transparent bg-primary text-white transition-all duration-300 hover:border-primary hover:bg-white hover:text-primary">
                Phone call
              </Button>
            </a>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
