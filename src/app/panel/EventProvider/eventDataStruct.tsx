import {
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Link from "next/link";
import { JSX, useState } from "react";

export const sortData = (
  eventDataArray: { [key: string]: any }[],
  setEventData: (data: { [key: string]: any }[]) => void,
  key: string,
  direction: number
) => {
  eventDataArray.sort((a, b) => {
    if (a[key] < b[key]) return -1 * direction;
    if (a[key] > b[key]) return 1 * direction;
    return 0;
  });
  setEventData({ ...eventDataArray });
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const EventTable = ({
  mapTable,
  eventDataArray,
  setEventData,
  renderActionColumn,
  actionColumnTitle,
}: {
  mapTable: { [key: string]: string };
  eventDataArray: { [key: string]: any }[];
  setEventData: (data: { [key: string]: any }[]) => void;
  renderActionColumn?: (data: { [key: string]: any }) => JSX.Element;
  actionColumnTitle?: string;
}) => {
  const [sortKey, setSortKey] = useState({
    key: "",
    direction: 1,
  });

  return (
    <TableContainer component={Paper}>
      <Table sx={{}} aria-label="simple table">
        <TableHead>
          <TableRow>
            {Object.keys(mapTable).map((key: string) => (
              <StyledTableCell
                key={key}
                onClick={() => {
                  sortData(
                    eventDataArray,
                    setEventData,
                    key,
                    sortKey.direction
                  );
                  setSortKey({
                    key,
                    direction: sortKey.direction * -1,
                  });
                }}
              >
                {mapTable[key]}
              </StyledTableCell>
            ))}
            {renderActionColumn && actionColumnTitle && (
              <StyledTableCell>{actionColumnTitle}</StyledTableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {eventDataArray?.map((data, index) => (
            <StyledTableRow key={index}>
              {Object.keys(mapTable).map((key: string) => {
                const value = data[key as keyof typeof data];
                return (
                  <StyledTableCell key={key}>
                    {typeof value === "object" ? (
                      <Link href={value.url || ""}>{value.name}</Link>
                    ) : (
                      value
                    )}
                  </StyledTableCell>
                );
              })}
              {renderActionColumn && (
                <TableCell>{renderActionColumn(data)}</TableCell>
              )}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
