import {
  Select as SelectShadCN,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";

interface SelectProps {
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}

const Select = ({ options, onChange, placeholder = "Select" }: SelectProps) => {
  return (
    <SelectShadCN onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectGroup>
          <SelectItem value="All">All</SelectItem>
          {options.map(({ value, label }, index) => (
            <SelectItem key={index} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </SelectShadCN>
  );
};

export default Select;
