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
    <input
      type="search"
      value={currentRefinement}
      onChange={(event) => refine(event.currentTarget.value)}
    />
    {isSearchStalled ? "My search is stalled" : ""}
  </form>
);

export const CustomSearchBox = connectSearchBox(SearchBox);
