const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="flex flex-col justify- items-center relative mt-[60 px] mb-8">
    <div className="self-stretch text-h3 font-bold text-center  text-neutral-900">{title}</div>
    <div className="self-stretch text-h4 font-regular text-center mt-3 text-neutral-400">{subtitle}</div>
  </div>
);

export default SectionHeader;
