// React
import { useState, useEffect } from 'react';

// Flowbite
import { TextInput } from "flowbite-react";
// HeroIcons
import { HiMenuAlt1 } from "react-icons/hi";
// SearchKit
import { connectSearchBox } from "react-instantsearch-dom";

// Debounce
import { useDebounce } from "../components/_debounce";

type SearchBoxProps = {
  currentRefinement: string;
  isSearchStalled: boolean;
  refine: (value: string) => void;
};

const SearchBox = ({
  currentRefinement,
  isSearchStalled,
  refine,
}: SearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState(currentRefinement);
  const debouncedSearchTerm = useDebounce(searchTerm, 250);

  useEffect(
    () => {
      refine(debouncedSearchTerm);
    },
    [debouncedSearchTerm]
  );

  return (
    <form noValidate action="" role="search" className="flex flex-col w-full">
      <TextInput
        id="search"
        type="search"
        placeholder="Search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.currentTarget.value)}
        required={false}
      />
      {isSearchStalled ? "My search is stalled" : ""}
    </form>
  );
};

export const CustomSearchBox = connectSearchBox(SearchBox);
