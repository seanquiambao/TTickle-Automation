import {
  Select as SelectShadCN,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "../ui/select";

const Select = () => {
  return (
    <SelectShadCN>
      <SelectTrigger className="border-black/20 placedholder:text-black/20">
        <SelectValue placeholder="filter" />
      </SelectTrigger>
      <SelectContent className="bg-white border-black/20">
        <SelectGroup>
          <SelectItem value="subject">subject</SelectItem>
          <SelectItem value="date">date</SelectItem>
        </SelectGroup>
      </SelectContent>
    </SelectShadCN>
  );
};

export default Select;
