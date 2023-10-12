const { TypesenseInstantSearchAdapter, instantsearch } = window;

const api = document.getElementsByClassName("mr-component")[0].id;
console.log(api)
const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: "doFRbKhVNu5cRp776sdnAhsv30A3l7n6", // Be sure to use an API key that only allows search operations
    nodes: [
      {
        host: "cgnvrk0xwyj9576lp-1.a1.typesense.net",
        port: "443",
        protocol: "https",
      },
    ],
    cacheSearchResultsForSeconds: 2 * 60, // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
  },
  // The following parameters are directly passed to Typesense's search API endpoint.
  //  So you can pass any parameters supported by the search endpoint below.
  //  query_by is required.
  additionalSearchParameters: {
    query_by: "api,model,description",
    sort_by: "total_organization_usage:desc,total_robot_usage:desc",
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

const search = instantsearch({
  indexName: "modular_models",
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      item: `
<div class="name"><a href="{{url}}"><code>{{#helpers.highlight}}{ "attribute": "model" }{{/helpers.highlight}}</code></a></div>
<div class="description">{{#helpers.highlight}}{ "attribute": "description" }{{/helpers.highlight}}</div>
`,
    },
  }),
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    placeholder: 'Search for a model...',
    poweredBy: false,
    wrapInput: true,
    showReset: false,
    showSubmit: false,
    showLoadingIndicator: false
  }),
  instantsearch.widgets.stats({
    container: '#searchstats',
    templates: {
      text(data, { html }) {
        let results = '';

        if (data.hasManyResults) {
          results += `Showing ${data.nbHits} results:`;
        } else if (data.hasOneResult) {
          results += `Showing 1 result:`;
        } else {
          results += ``;
        }

        return html`<span>${results}</span>`;
      },
    },
  }),
  instantsearch.widgets.configure({
    facetFilters: ["api: " + api],
    hitsPerPage: 5,
  }),
  instantsearch.widgets.pagination({
    container: "#pagination",
    scrollTo: false
  }),
]);

search.start();
