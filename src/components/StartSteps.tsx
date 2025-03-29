import styles from "@/lib/styles";

const StartSteps = ({ number, text }: { number: number; text: string }) => (
  <div className={`${styles.flexCenter} flex-row`}>
    <div
      className={`${styles.flexCenter} h-[70px] w-[70px] rounded-[24px] bg-[#323f5d] text-white`}
    >
      <p className="text-[20px] font-bold">0{number}</p>
    </div>
    <p className="ml-[30px] flex-1 text-[17px] font-normal leading-[32px] text-muted-foreground">
      {text}
    </p>
  </div>
);

export default StartSteps;
