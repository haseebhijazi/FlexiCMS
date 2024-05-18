import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// const columns = [
//   { field: 'id', headerName: 'ID', width: 140 },
//   { field: 'entities_id', headerName: 'Entity ID', width: 140},
//   { field: 'entity_display_name', headerName: 'Entity', width: 500 },
// ];

// const rows = [
//   { id: 1, entities_id: 1, entity_display_name: 'Haseeb'},
// ];

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