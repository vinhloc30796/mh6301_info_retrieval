# MH6301 - Information Retrieval

## Project

This repository contains the code for the MH6301 - Information Retrieval project at the Nanyang Technological University (NTU). The project creates a simple app that enables searching on the businesses included in the [Yelp Dataset](https://www.yelp.com/dataset).

### Description

The project is divided into three main parts:

- **ElasticSearch**: The ElasticSearch instance that indexes the Yelp dataset (only hosted in the Docker Compose file)
- **Indexer** (hosted in the `./backend` folder): The Python script that indexes the Yelp dataset into the ElasticSearch instance.
- **App** (hosted in the `./frontend` folder): The React app that enables searching on the indexed data.

In addition, the `./data` folder contains only the `business.json` file from the Yelp dataset. The full dataset can be downloaded from the [Yelp Dataset](https://www.yelp.com/dataset) website.

### Preview

Please view the [preview video](https://www.loom.com/share/94a4e1da0b704fafb01f7b2b46bf06e6) for a quick overview of the project.

### Usage

Assuming you have cloned this repo to your local machine, there are two main ways to run the project:

#### With Docker (recommended)

1. Ensure you have Docker Compose installed on your machine.
2. Navigate to the root directory of the project in your terminal.
3. Build and run the Docker containers by running `docker-compose up -d`.
4. Open your web browser and navigate to `http://localhost:3000` to access the application.

#### Without Docker

1. Ensure you have Elasticsearch, Python, Node.js and npm installed on your machine.
2. Start Elasticsearch locally.
3. Navigate to the root directory of the project in your terminal.
4. Install Python dependencies by running `pip install -r requirements.txt` (This assumes `requirements.txt` is in the root directory).
5. Prepare and start the Python indexer by running `python index.py`.
6. Install Node.js dependencies by running `npm install`.
7. Once dependencies are installed, you can start the application with `npm run start`.
8. Open your web browser and navigate to `http://localhost:3000` to access the application.

## Progress Log

### 2023-04-22

Dark modes

- https://github.com/aniftyco/awesome-tailwindcss#tools
- https://tailwindcss.com/docs/dark-mode
- https://blog.logrocket.com/theming-react-components-tailwind-css/
- https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_example/
- https://tailwindcomponents.com/component/layout-with-header-sidebar-and-rightbar

### 2023-04-20

- https://mantine.dev/core/app-shell/
- https://www.searchkit.co/docs/getting-started/with-react
- https://github.com/searchkit/searchkit/blob/main/examples/with-ui-nextjs-react/pages/index.tsx
- https://www.algolia.com/doc/guides/building-search-ui/getting-started/react/?client=jsx
    - Alternatively: https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react-hooks/


### TODOs:

#### Backend & Search

- [x] Enable array indexing for array fields (e.g. business.categories, checkin.date, etc.)
    - Reference: EiA, 3.3.1 Arrays
- [ ] Enable nested type indexing for nested fields (e.g. business.hours, business.attributes, etc.)
    - Reference: EiA, 8.3 Nested type
- [x] Enable geolocation indexing for long/lat fields (e.g. business.latitude, business.longitude, etc.)
    - Reference: EiA, Appendix A Working with geospatial data

#### Front-end

- [ ] Enable dark mode

#### DevOps

- [x] Dockerize everything

Note: EiA = Elasticsearch in Action (1st Edition)