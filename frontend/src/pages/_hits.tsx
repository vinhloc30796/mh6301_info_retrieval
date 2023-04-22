import { connectHits, Highlight, } from "react-instantsearch-dom";

type HitsProps = {
  hits: any[];
};

const Hits = ({ hits }: HitsProps) => (
  // return the DOM output
  <ol>
    {hits.map(hit => (
      <a href="#" className="block p-6 mb-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          <Highlight attribute="name" hit={hit} />

        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          <Highlight attribute="address" hit={hit} />
        </p>
      </a>
    ))}
  </ol>
);

export const CustomHits = connectHits(Hits);
