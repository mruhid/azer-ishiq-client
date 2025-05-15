import { MonitorIcon, Podcast, SearchCodeIcon, User2 } from "lucide-react";
import Image, { StaticImageData } from "next/image";

interface DeveloperInfoProps {
  title: string;
  developerUrl: StaticImageData;
  fullname: string;
  me: string;
  job: string;
  jobDescription: string;
  toolTitle: string;
  tools: string;
  responsiblityTitle: string;
  responsiblityDescription: string;
}

export default function Developer({
  title,
  developerUrl,
  fullname,
  me,
  job,
  jobDescription,
  toolTitle,
  tools,
  responsiblityTitle,
  responsiblityDescription,
}: DeveloperInfoProps) {
  return (
    <section className="flex flex-col items-center justify-center rounded-xl px-4 py-16">
      <h1 className="mb-10 text-center text-4xl font-bold capitalize text-white">
        {title}
      </h1>

      <div className="flex h-full w-full max-w-5xl flex-col-reverse overflow-hidden rounded-xl border bg-card shadow-xl md:flex-row">
        {/* Left Column: Info Grid */}
        <div className="grid w-full grid-cols-1 gap-8 p-8 md:w-1/2 md:grid-cols-2">
          <div className="flex flex-col items-start">
            <SearchCodeIcon size={36} className="mb-2 text-primary" />
            <h3 className="text-lg font-semibold capitalize">{job}</h3>
            <p className="text-sm text-muted-foreground">{jobDescription}</p>
          </div>
          <div className="flex flex-col items-start">
            <User2 size={36} className="mb-2 text-primary" />
            <h3 className="text-lg font-semibold capitalize">{fullname}</h3>
            <p className="text-sm text-muted-foreground">{me}</p>
          </div>
          <div className="flex flex-col items-start">
            <Podcast size={36} className="mb-2 text-primary" />
            <h3 className="text-lg font-semibold capitalize">
              {responsiblityTitle}
            </h3>
            <p className="text-sm text-muted-foreground">
              {responsiblityDescription}
            </p>
          </div>
          <div className="flex flex-col items-start">
            <MonitorIcon size={36} className="mb-2 text-primary" />
            <h3 className="text-lg font-semibold capitalize">{toolTitle}</h3>
            <p className="text-sm text-muted-foreground">{tools}</p>
          </div>
        </div>

        {/* Right Column: Developer Image */}
        <div className="w-full md:w-1/2">
          <Image
            src={developerUrl}
            alt={`${fullname} photo`}
            className="h-full w-full object-cover md:rounded-r-xl"
          />
        </div>
      </div>
    </section>
  );
}
