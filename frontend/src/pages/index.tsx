import Head from "next/head";

// import styles from "@/styles/Home.module.css";

import React from "react";
// Flowbite
import { Navbar, Sidebar } from "flowbite-react";
// HeroIcons
import { HiChartPie, HiShoppingBag } from "react-icons/hi2";
// Radix
import * as Separator from "@radix-ui/react-separator";
// SearchKit
import Client from "@searchkit/instantsearch-client";
import {
  InstantSearch,
  Hits,
  Snippet,
  RefinementList,
  Pagination,
  NumericMenu,
} from "react-instantsearch-dom";
// Local
import App from "./_app";
import CustomNavbar from "../components/_navbar"
import { CustomSearchBox } from "../components/_searchbox";
import { CustomHits } from "../components/_hits";
import { CustomRefinementList } from "../components/_refinementlist";

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
          <div className="w-fit fixed top-0 left-0 z-40 pt-10">
            <Sidebar className="z-40">
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                <Separator.Root className="SeparatorRoot mt-2 mb-2 h-px bg-gray-200 dark:bg-gray-700" orientation="horizontal" />

                  <CustomRefinementList attribute="categories" limit={5} showMore={true} />
                  <Separator.Root className="SeparatorRoot mt-2 mb-2 h-px bg-gray-200 dark:bg-gray-700" orientation="horizontal" />
                  <Sidebar.Item
                    href="#"
                    icon={HiChartPie}
                  >
                    To Do
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
              {/* <p className="text-2xl text-gray-400 dark:text-gray-500">+</p> */}
              <CustomSearchBox />

            </div>
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-4">
              {/* <p className="text-2xl text-gray-400 dark:text-gray-500">+</p> */}
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
