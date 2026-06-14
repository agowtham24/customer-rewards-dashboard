import PropTypes from "prop-types";
import { useMemo, useState } from "react";
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
 * Reusable rewards table section with search and loading state.
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {string} props.description
 * @param {Array} props.columns
 * @param {Array} props.rows
 * @param {boolean} props.loading
 * @param {Function} props.getRowKey
 * @param {string} [props.searchValue]
 * @param {Function} props.onSearchChange
 * @param {string} [props.searchPlaceholder]
 * @returns {JSX.Element}
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

function EmptyTableRow({ colSpan }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        No records found.
      </TableCell>
    </TableRow>
  );
}

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
}) {
  const skeletonRows = Array.from({ length: 4 });

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  function handleSort(accessor) {
    if (sortColumn === accessor) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(accessor);
      setSortDirection("asc");
    }
  }

  const sortedRows = useMemo(() => {
    if (loading || !sortColumn) {
      return rows;
    }

    return [...rows].sort((a, b) => {
      const left = a[sortColumn];
      const right = b[sortColumn];

      if (typeof left === "number" && typeof right === "number") {
        return sortDirection === "asc" ? left - right : right - left;
      }

      return sortDirection === "asc"
        ? String(left).localeCompare(String(right))
        : String(right).localeCompare(String(left));
    });
  }, [rows, loading, sortColumn, sortDirection]);

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
                        ? () => handleSort(column.accessor)
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
              ) : sortedRows.length > 0 ? (
                <DataTableRows
                  rows={sortedRows}
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
};

export default RewardsSection;
