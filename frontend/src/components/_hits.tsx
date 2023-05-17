// Flowbite
import { Card, Badge } from "flowbite-react";
// HeroIcons
import { HiChartPie, HiShoppingBag } from "react-icons/hi2";
// Radix
import * as Separator from "@radix-ui/react-separator";
// SearchKit
import { connectHits, Highlight, } from "react-instantsearch-dom";

type Hit = {
  objectID: string;
  business_id: string;
  name: string;
  address: string;
  stars: number;
  categories: string[];
};

type HitsProps = {
  hits: Hit[];
};

const Hits = ({ hits }: HitsProps) => (
  <ol className="grid grid-cols-4 gap-4">
    {hits.map(hit => (
      <li key={hit.objectID}>
        <Card className="mb-4 p-4 h-60" href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            <Highlight attribute="name" hit={hit} />
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            <Highlight attribute="address" hit={hit} />
          </p>
          <Separator.Root className="SeparatorRoot mt-2 mb-2 h-px bg-gray-200 dark:bg-gray-700" orientation="horizontal" />
          <div className="flex flex-row max-w-full align-middle">
            <Badge
              size="sm"
              // Blue
              className="inline-block mr-2 text-white bg-blue-500"
            >
              Rating: {hit.stars}
            </Badge>
            {
              // Make hit.stars stars
              Array.from({ length: hit.stars }, (_, i) => (
                <HiChartPie
                  key={`${hit.objectID}-star-${i}`}
                  className="inline-block w-4 h-4 text-yellow-500"
                />
              ))
            }
          </div>
        </Card>
      </li>
    ))}
  </ol>
);

export const CustomHits = connectHits(Hits);
