import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import { JSX } from "react";
import Link from "next/link";

export const EventTable = ({
  mapTable,
  eventDataArray,
  renderActionColumn,
  actionColumnTitle,
}: {
  mapTable: {
    [key: string]: {
      label: string;
      type: string;
      sortKey?: string;
    };
  };
  eventDataArray: { [key: string]: any }[];
  setEventData: (data: { [key: string]: any }[]) => void;
  renderActionColumn?: (data: { [key: string]: any }) => JSX.Element;
  actionColumnTitle?: string;
}) => {
  function descendingComparator<T>(
    a: T,
    b: T,
    orderBy: keyof T,
    sortKey?: string
  ) {
    const aValue = sortKey ? a[sortKey] : a[orderBy];
    const bValue = sortKey ? b[sortKey] : b[orderBy];
    if (bValue < aValue) {
      return -1;
    }
    if (bValue > aValue) {
      return 1;
    }
    return 0;
  }

  type Order = "asc" | "desc";

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
    sortKey?: string
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
  ) => number {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy, sortKey)
      : (a, b) => -descendingComparator(a, b, orderBy, sortKey);
  }

  const headCells = Object.entries(mapTable)
    .map(([key, value]) => ({
      id: key,
      numeric: value.type === "number",
      disablePadding: true,
      label: value.label,
      sortKey: value.sortKey || key,
    }))
    .concat(
      renderActionColumn && actionColumnTitle
        ? [
            {
              id: "@_action",
              numeric: false,
              disablePadding: true,
              label: actionColumnTitle,
              sortKey: "",
            },
          ]
        : []
    );

  interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (
      event: React.MouseEvent<unknown>,
      property: string,
      sort?: string
    ) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
  }

  const [activeSortKey, setActiveSortKey] = React.useState<string | undefined>(
    headCells[0]?.sortKey
  );

  function EnhancedTableHead(props: EnhancedTableProps) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler =
      (property: string, sort?: string) =>
      (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property, sort);
      };

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              // align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              {headCell.sortKey ? (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id, headCell.sortKey)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              ) : (
                headCell.label
              )}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<any>(headCells[0].id);
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const dense = false;
  const page = 0;
  const rowsPerPage = 10;

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof typeof headCells | string,
    sortKey?: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    setActiveSortKey(sortKey);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = eventDataArray.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - eventDataArray.length)
      : 0;

  const visibleRows = React.useMemo(() => {
    return [...eventDataArray].sort(
      getComparator(order, orderBy, activeSortKey)
    );
  }, [order, orderBy, activeSortKey, eventDataArray]);

  return (
    <Box>
      <TableContainer>
        <Table aria-labelledby="tableTitle" size={dense ? "small" : "medium"}>
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={eventDataArray.length}
          />
          <TableBody>
            {visibleRows?.map((data: { [key: string]: any }, index: number) => {
              return (
                <TableRow key={index + data["@_id"]}>
                  {Object.keys(mapTable).map((key: string) => {
                    const value = data[key as keyof typeof data];
                    return (
                      <TableCell key={key}>
                        {typeof value === "object" ? (
                          <Link href={value.url || ""}>{value.name}</Link>
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                  {renderActionColumn && (
                    <TableCell>{renderActionColumn(data)}</TableCell>
                  )}
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: (dense ? 33 : 53) * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
