import React from "react";
import { useState } from "react";

// Flowbite
import { Sidebar, Button, ListGroup } from "flowbite-react";
// HeroIcons
import { HiMenuAlt1 } from "react-icons/hi";
// SearchKit
import { connectRefinementList } from "react-instantsearch-dom";

type RefinementListProps = {
  attribute: string;
  items: any[];
  currentRefinement: string[];
  refine: (value: string[]) => void;
  limit: number;

  isFromSearch: boolean;
  searchForItems: (value: string) => void;
  createURL: (value: string) => void;
};

const RefinementList = ({
  attribute,
  items,
  currentRefinement,
  refine,
  limit,
  isFromSearch,
  searchForItems,
  createURL,
}: RefinementListProps) => {
  const [more, setMore] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const capitalizedAttribute: string = attribute.charAt(0).toUpperCase() + attribute.slice(1);

  return (<Sidebar.Collapse label="Categories" icon={HiMenuAlt1}>
    <ListGroup
    >
      {items.map((item, i) => (i < limit || more) && (
        <a
          href=""
          style={{ fontWeight: item.isRefined ? 'bold' : '' }}
          onClick={event => {
            event.preventDefault();
            refine(item.value);
          }}
        >
          <ListGroup.Item
            key={item.label}
          >
            {item.label} ({item.count})
          </ListGroup.Item>
        </a>
      ))}
    </ListGroup>
    <Button
      size="xs"
      // align left
      className="w-full"
      onClick={() => { setMore(!more); }}
    >
      Show {more ? 'less' : 'more'}
    </Button>
  </Sidebar.Collapse>)
};

export const CustomRefinementList = connectRefinementList(RefinementList);