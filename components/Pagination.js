import Head from "next/head";
import Link from "next/link";
import gql from "graphql-tag";
import { useQuery } from "urql";
import PaginationStyles from "./styles/PaginationStyles";
import DisplayError from "./ErrorMessage";
import { perPage } from "../config";

export const PAGINATION_QUERY = gql`
  query {
    _allTournamentsMeta {
      count
    }
  }
`;

export default function Pagination({ page }) {
  const { error, loading, data } = useQuery(PAGINATION_QUERY);
  if (loading) return null;
  if (error) return <DisplayError error={error} />;
  const { count } = data._allTournamentsMeta;
  const pageCount = Math.ceil(count / perPage);

  return (
    <PaginationStyles>
      <Head>
        <title>
          League Eliminator - Page {page} of {pageCount}
        </title>
      </Head>
      <Link href={`/tournaments/${page - 1}`}>
        <a aria-disabled={page <= 1}>← Prev</a>
      </Link>
      <p>
        Page {page} of {pageCount}
      </p>
      <p>{count} Items Total</p>
      <Link href={`/products/${page + 1}`}>
        <a aria-disabled={page >= pageCount}>Next →</a>
      </Link>
    </PaginationStyles>
  );
}