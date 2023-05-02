// Flowbite
import { TextInput } from "flowbite-react";
// HeroIcons
import { HiMenuAlt1 } from "react-icons/hi";
// SearchKit
import { connectSearchBox } from "react-instantsearch-dom";

type SearchBoxProps = {
  currentRefinement: string;
  isSearchStalled: boolean;
  refine: (value: string) => void;
};

const SearchBox = ({
  currentRefinement,
  isSearchStalled,
  refine,
}: SearchBoxProps) => (
  <form noValidate action="" role="search" className="flex flex-col w-full">
    <TextInput
      id="search"
      type="search"
      placeholder="Search"
      value={currentRefinement}
      onChange={(event) => refine(event.currentTarget.value)}
      required={false}
    />
    {isSearchStalled ? "My search is stalled" : ""}
  </form>
);

export const CustomSearchBox = connectSearchBox(SearchBox);
