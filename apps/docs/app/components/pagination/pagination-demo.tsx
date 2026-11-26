'use client';

import { Pagination } from '@mizunagara/react';
import { useState } from 'react';

const TOTAL_PAGES = 12;

export function PaginationDemo() {
  const [page, setPage] = useState(3);
  const first = (page - 1) * 20 + 1;
  const last = Math.min(page * 20, 240);

  return (
    <Pagination
      page={page}
      totalPages={TOTAL_PAGES}
      onPageChange={setPage}
      label={`Showing ${first}–${last} of 240`}
    />
  );
}
