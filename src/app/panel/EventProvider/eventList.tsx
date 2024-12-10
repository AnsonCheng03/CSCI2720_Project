import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { JSX } from "react";
import Link from "next/link";
import styles from "./list.module.css";

export const EventList = ({
  mapTable,
  eventDataArray,
  renderActionColumn,
  actionColumnTitle,
}: {
  mapTable: { [key: string]: string };
  eventDataArray: { [key: string]: any }[];
  setEventData: (data: { [key: string]: any }[]) => void;
  renderActionColumn?: (data: { [key: string]: any }) => JSX.Element;
  actionColumnTitle?: string;
}) => {
  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  type Order = "asc" | "desc";

  function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key
  ): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
  ) => number {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const headCells = Object.entries(mapTable)
    .map(([key, value]) => ({
      id: key,
      numeric: false,
      disablePadding: true,
      label: value,
    }))
    .concat(
      renderActionColumn && actionColumnTitle
        ? [
            {
              id: "@_action",
              numeric: false,
              disablePadding: true,
              label: actionColumnTitle,
            },
          ]
        : []
    );

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<any>(headCells[0].id);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const visibleRows = React.useMemo(
    () => [...eventDataArray].sort(getComparator(order, orderBy)),
    [order, orderBy, page, rowsPerPage, eventDataArray]
  );

  return (
    <div className={styles.page}>
      {visibleRows?.map((data: { [key: string]: any }, index: number) => {
        return (
          <div className={styles.eventRow} key={index}>
            {Object.keys(mapTable).map((key: string) => {
              console.log(key, data);
              const value = data[key as keyof typeof data];
              return (
                <div className={styles.eventContainer} key={key + index}>
                  <div className={styles.columnName}>
                    {mapTable[key as keyof typeof mapTable]}
                  </div>
                  <div className={styles.eventColumn}>
                    {typeof value === "object" ? (
                      <Link href={value.url || ""}>{value.name}</Link>
                    ) : (
                      value
                    )}
                  </div>
                </div>
              );
            })}

            {renderActionColumn && actionColumnTitle && (
              <div className={styles.eventContainer}>
                <div className={styles.columnName}>{actionColumnTitle}</div>
                <div className={styles.eventColumn}>
                  {renderActionColumn(data)}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
