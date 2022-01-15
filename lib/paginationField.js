import { PAGINATION_QUERY } from "../components/Pagination";

export default function paginationField() {
  return {
    read(existing = [], { args, cache }) {
      const { skip, first } = args;
      // read the number of items on page from cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // check if there are existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // if
      // there are items
      // AND not enough items to satisfy how many were requested
      // AND on last page
      // THEN send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // no items, go to network to fetch them
        return false;
      }

      // if there are items, return from cache, no network
      if (items.length) {
        return items;
      }

      return false;

      // first it asks the read function for items
      // we can do one of two things:
      // first, return the items because they are already in cache
      // alternatively, return false causing network request
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // this runs when Apollo client comes back from network with products
      const merged = existing ? existing.slice(0) : [];
      merged.push(incoming);
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      // return merged items from cache
      return merged;
    },
  };
}
