import MultipleSelector, { Option } from "@/components/ui/multiselect";

interface MultiselectProps {
  data: Option[];
  label?: string;
  value: Option[];
  onChange: (value: Option[]) => void;
}

export default function Multiselect(props: MultiselectProps) {
  const { label, value, onChange, data } = props;
  const _label = label ? `Pilih ${label}` : "Pilih";

  return (
    <MultipleSelector
      value={value}
      onChange={onChange}
      commandProps={{
        label: _label,
      }}
      defaultOptions={data}
      placeholder={_label}
      emptyIndicator={<p className="text-center text-sm">{label ?? "Data"} tidak tersedia</p>}
    />
  );
}
