import {ChevronLeftIcon, ChevronRightIcon} from '@formizee/ui/icons';
import type {Table} from '@tanstack/react-table';
import {Button} from '@formizee/ui';

interface TablePaginationProps<TData> {
  table: Table<TData>;
}

export function TablePagination<TData>({table}: TablePaginationProps<TData>) {
  if (table.getPageCount() < 1) {
    return <div />;
  }

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        page {table.getState().pagination.pageIndex + 1} of{' '}
        {table.getPageCount()}.
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeftIcon />
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
        <ChevronRightIcon />
      </Button>
    </div>
  );

  /*
  return (
    <nav className="flex flex-row w-full justify-center gap-4 my-6">
      <Button
        variant="outline"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeftIcon />
        Previous
      </Button>
      <ul className="flex flex-row items-center gap-2">
        <li>
          <Button size="icon" variant="ghost">
            1
          </Button>
        </li>
        <li>
          <Button size="icon" variant="outline">
            2
          </Button>
        </li>
        <li>
          <Button size="icon" variant="ghost">
            3
          </Button>
        </li>
      </ul>
      <Button
        variant="outline"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
        <ChevronRightIcon />
      </Button>
    </nav>
  );
  */
}
