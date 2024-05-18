import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function DataTable(props) {
  return (
    <ThemeProvider theme={darkTheme}>
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid
            rows={props.rows}
            columns={props.columns}
            initialState={{
            pagination: {
                paginationModel: { page: 0, pageSize: 5 },
            },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
        />
        </div>
    </ThemeProvider>
  );
}