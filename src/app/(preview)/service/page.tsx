import ServiceFeed from "./ServiceFeed";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Electronic Services</h1>
      <ServiceFeed />
    </main>
  );
}
