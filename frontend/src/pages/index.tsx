import React from "react";
// Flowbite
import { Sidebar } from "flowbite-react";
// HeroIcons
import { HiShoppingBag } from "react-icons/hi2";
// Radix
import * as Separator from "@radix-ui/react-separator";
// SearchKit
import Client from "@searchkit/instantsearch-client";
import { InstantSearch, Configure } from "react-instantsearch-dom";
// Local
import App from "./_app";
import CustomNavbar from "../components/_navbar"
import { CustomSearchBox } from "../components/_searchbox";
import { CustomRangeSlider } from "../components/_rangeslider";
import { CustomHits } from "../components/_hits";
import { CustomRefinementList } from "../components/_refinementlist";
import GoogleMapsLoader from "../components/_mapsloader";
import CustomGeoSearch from "../components/_geosearch";

const searchClient = Client({
  url: "/api/search",
});

export default function Home() {
  return (
    <>
      <header className="justify-between py-3">
        <title>Loc Nguyen - MH6818 Yelp</title>
        <meta
          name="description"
          content="MH6818 Information Retrieval: ElasticSearch with Yelp Dataset"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <CustomNavbar />
      </header>
      <main>

        <InstantSearch indexName="business" searchClient={searchClient}>
          <Configure hitsPerPage={1000} />
          <div className="w-fit fixed top-0 left-0 z-40 pt-10">
            <Sidebar className="z-40">
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                  <Separator.Root className="SeparatorRoot mt-2 mb-2 h-px bg-gray-200 dark:bg-gray-700" orientation="horizontal" />
                  <CustomRefinementList attribute="categories" limit={5} showMore={true} />
                  <Separator.Root className="SeparatorRoot mt-2 mb-2 h-px bg-gray-200 dark:bg-gray-700" orientation="horizontal" />
                  <Sidebar.Item className="px-0">
                    <CustomRangeSlider attribute="stars" min={0} max={5} step={0.1} />
                  </Sidebar.Item>
                  <Sidebar.Item
                    href="#"
                    icon={HiShoppingBag}
                  >
                    To Do
                  </Sidebar.Item>
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </Sidebar>
          </div>

          <div className="p-4 mt-5 sm:ml-64">
            <div className="flex items-center justify-center my-4 rounded bg-gray-50 dark:bg-gray-800">
              <CustomSearchBox />
            </div>
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-4 h-1/4">
              <GoogleMapsLoader
                libraries={["marker"]}
                render={google => <CustomGeoSearch google={google} />}
              />
            </div>
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-4">
              <div className="grid gap-4 mb-4">
                <CustomHits />
              </div>
            </div>

          </div>
        </InstantSearch>
      </main>

    </>
  );
}
