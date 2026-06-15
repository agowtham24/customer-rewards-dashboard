import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { Skeleton } from "../components/ui/Skeleton";

/**
 * Loading skeleton rows.
 */
function LoadingTableRows({ columns, skeletonRows }) {
  return skeletonRows.map((_, rowIndex) => (
    <TableRow key={`skeleton-${rowIndex}`}>
      {columns.map((column) => (
        <TableCell key={column.header}>
          <Skeleton className="h-4 w-full rounded-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

/**
 * Data rows.
 */
function DataTableRows({ rows, columns, getRowKey }) {
  return rows.map((row, rowIndex) => (
    <TableRow key={getRowKey(row, rowIndex)}>
      {columns.map((column) => (
        <TableCell key={column.header} className={column.cellClassName}>
          {column.render ? column.render(row, rowIndex) : row[column.accessor]}
        </TableCell>
      ))}
    </TableRow>
  ));
}

/**
 * Empty state row.
 */
function EmptyTableRow({ colSpan }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        No records found.
      </TableCell>
    </TableRow>
  );
}

/**
 * Reusable rewards table section.
 */
function RewardsSection({
  title,
  description,
  columns,
  rows,
  loading,
  getRowKey,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  sortColumn,
  sortDirection,
  onSort,
}) {
  const skeletonRows = Array.from({ length: 4 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="max-w-sm">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
          />
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.header}
                    className={`${
                      column.sortable ? "cursor-pointer select-none" : ""
                    } ${column.className ?? ""}`}
                    onClick={
                      column.sortable
                        ? () => onSort(column.accessor)
                        : undefined
                    }
                  >
                    {column.header}

                    {column.sortable &&
                      (sortColumn === column.accessor
                        ? sortDirection === "asc"
                          ? " ↑"
                          : " ↓"
                        : " ↑ ↓")}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <LoadingTableRows
                  columns={columns}
                  skeletonRows={skeletonRows}
                />
              ) : rows.length > 0 ? (
                <DataTableRows
                  rows={rows}
                  columns={columns}
                  getRowKey={getRowKey}
                />
              ) : (
                <EmptyTableRow colSpan={columns.length} />
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

RewardsSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string,
      sortable: PropTypes.bool,
      className: PropTypes.string,
      cellClassName: PropTypes.string,
      render: PropTypes.func,
    }),
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  getRowKey: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.string,
  onSort: PropTypes.func.isRequired,
};

LoadingTableRows.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  skeletonRows: PropTypes.array.isRequired,
};

DataTableRows.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  getRowKey: PropTypes.func.isRequired,
};

EmptyTableRow.propTypes = {
  colSpan: PropTypes.number.isRequired,
};

export default RewardsSection;