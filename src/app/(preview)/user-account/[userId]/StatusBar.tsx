export default function StatusBar() {
  const statusArr = ["Qeydiyyat","Kod açma", "Sayğac quraşdırma", "TM əlaqəsi", "Müqavilə"];
  const status = 3;
  return (
    <div className="rounded-2xl border border-muted-foreground/40 bg-card p-6 shadow-md">
      <h3 className="mb-4 text-lg font-bold">Status</h3>
      <ul className="space-y-3">
        {statusArr.map((item, i) => (
          <li key={i} className="flex justify-between">
            <span>{item}</span>
            <span
              className={`rounded-full ${i + 1 <= status ? `bg-green-100 text-green-700` : `bg-red-100 text-red-700`} px-2 py-1 text-sm`}
            >
              {i + 1 <= status ? "Təstiq" : "Gözləmə"}
            </span>
          </li>
        ))}
        
      </ul>
    </div>
  );
}
