// Flowbite
import { Card } from "flowbite-react";
// SearchKit
import { connectHits, Highlight, } from "react-instantsearch-dom";

type HitsProps = {
  hits: any[];
};

const Hits = ({ hits }: HitsProps) => (
  <ol>
    {hits.map(hit => (
      <Card className="mb-4 p-4" href="#"> 
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          <Highlight attribute="name" hit={hit} />
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          <Highlight attribute="address" hit={hit} />
        </p>
      </Card>
    ))}
  </ol>
);

export const CustomHits = connectHits(Hits);
