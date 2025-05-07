import Image from "next/image";

export default function NotificationBoxes() {
  return (
    <div className="flex flex-col gap-6 py-6 md:flex-row">
      <div className="flex w-full flex-col items-center justify-between rounded-xl bg-[#3A3EAE] px-6 py-14 text-white md:w-1/2 md:flex-row">
        <div className="flex-1">
          <h2 className="mb-2 text-lg font-semibold">Elektron bildiriş al</h2>
          <p className="mb-4 text-sm">
            Əlaqə məlumatlarınızı daxil edərək elektron bildiriş sistemində qeyd
            olun və bildirişlər aylıq olaraq sizə gələcək.
          </p>
          <button className="rounded border border-white px-5 py-4 transition-all duration-300 hover:bg-white hover:text-[#3A3EAE]">
            E-bildiriş al
          </button>
        </div>
        <div className="mt-4 md:ml-4 md:mt-0">
          <Image
            src={"/assets/bell-purple.png"}
            alt="bell"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-between rounded-xl bg-[#E8403F] p-6 text-white md:w-1/2 md:flex-row">
        <div className="flex-1">
          <h2 className="mb-2 text-lg font-semibold">
            Qəza ilə bağlı məlumat ver
          </h2>
          <p className="mb-4 text-sm">
            Baş vermiş qəza hallarını bizə məlumat verərək problemin tez bir
            zamanda həllinə kömək edin
          </p>
          <button className="rounded-lg border border-white bg-[#E8403F] px-5 py-4 transition-all duration-300 hover:bg-white hover:bg-opacity-90 hover:text-destructive">
            Məlumat ver
          </button>
        </div>
        <div className="mt-4 md:ml-4 md:mt-0">
          <Image
            src={"/assets/speaker-white.png"}
            alt="speaker"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
