"use client";
import SubstationDataTable from "./SubstationsDataTable";
import SubstationSelect from "./SubstationSelect";
export default function SubstationFeed() {
  return (
    <div className="flex flex-col py-2 gap-y-3 justify-center items-center">
      <SubstationSelect />
      <SubstationDataTable />
    </div>
  );
}
