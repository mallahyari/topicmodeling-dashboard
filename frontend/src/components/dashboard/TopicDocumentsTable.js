import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import DocumentTopicHeatmap from './DocumentTopicHeatmap';

const columns = [
  { label: 'Title' },
  { label: 'Announcement' },
  { label: 'Topic' },
  { label: 'Title-Topic Distribution' },
];

const TopicDocumentsTable = ({ topicDocuments, topics }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {columns.map((col, i) => (
                <TableCell key={i} align="center">
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {topicDocuments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={`row-${index}`}>
                  <CardTableCell
                    key={`cell-${Math.random()}`}
                    title={row.title}
                    company={row.company}
                    seniorityLevel={row.seniority_level}
                  />
                  <TableCell key={`cell-${Math.random()}`}>
                    {row.announcement}
                  </TableCell>
                  <TableCell key={`cell-${Math.random()}`}>
                    {row.topic}
                  </TableCell>
                  <TableCell key={`cell-${Math.random()}`}>
                    <DocumentTopicHeatmap
                      titleTokens={row.title_tokens}
                      topics={topics}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={topicDocuments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

const CardTableCell = ({ title, company, seniorityLevel }, ...restProps) => {
  return (
    <TableCell>
      <Card elevation={0}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ fontSize: 15 }}
            component="div"
            gutterBottom
          >
            {title}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {company}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {seniorityLevel}
          </Typography>
        </CardContent>
      </Card>
    </TableCell>
  );
};

export default TopicDocumentsTable;
