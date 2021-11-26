import * as React from 'react';
import firebase from 'firebase';
import { db } from '../firebase'

import { Link } from "react-router-dom"

import styled from 'styled-components';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const columns = [
  { id: 'name', label: 'Name', minWidth: 60 },
  {
    id: 'color',
    label: 'Color',
    align: 'right',
    format: (value) => <div 
      style={{display: 'flex', justifyContent: 'center'}}
    >
      <div 
        style={
          {  
            background: `${value}`, 
            width: '22px', 
            height: '22px', 
            borderRadius: '50%'
          }
        }
      >
      </div>
    </div>,
  },
  {
    id: 'ean',
    label: 'Ean',
    minWidth: 200,
    align: 'center',
    format: (value) => value,
  },
  {
    id: 'price',
    label: 'Price $',
    minWidth: 150,
    align: 'center',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'type',
    label: 'Type',
    align: 'center',
    format: (value) => value
  },
  {
    id: 'quantity',
    label: 'Quantity',
    align: 'center',
    format: (value) => value
  },
  {
    id: 'weight',
    label: 'Weight',
    align: 'center',
    format: (value) => value
  },
];


export default function ColumnGroupingTable() {
  const db = firebase.firestore();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [products, setProducts] = React.useState([])
  const [loading, setLoading] = React.useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  const deleteItem = async (itemId) => {
      const itemToDelete = db.collection('products').doc(itemId);

      await itemToDelete.delete()
  };
  
  const getProducts = () => {
    db.collection('products').onSnapshot((snapshot) =>{
        let tempProducts = []
        tempProducts = snapshot.docs.map((doc)=> (
            {
                id: doc.id, 
                product: doc.data()
            }
        ));
        
        setProducts(tempProducts);
        setLoading(false);
    });
  }; 

  React.useEffect(() => {
    getProducts()
  }, []);

  return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{  minWidth: column.minWidth }}
                  >
                  {column.label}
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell align="center" colSpanTableCell={6}>
                  <CircularProgress/>
                </TableCell>
              </TableRow>
            )}
            {products
              .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row.product[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <ButtonWrapper>
                        <DeleteWrap>
                          <DeleteIcon onClick = {() => deleteItem(row.id)} />
                        </DeleteWrap>
                        <EditWrap>
                          <Link to={`/edit/${row.id}`}>
                            <EditIcon/>
                          </Link>
                        </EditWrap>
                        <ViewIconWrapper>
                          <Link to={`/view/${row.id}`}>
                            <OpenInNewIcon/>
                          </Link>
                        </ViewIconWrapper>
                      </ButtonWrapper>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
  );
}

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const DeleteWrap = styled.div`
  margin-right:14px ;
  cursor: pointer;
  svg.MuiSvgIcon-root:hover {
    color: rgb(255, 116, 118);
    transform: translateY(-4px);
    transition: 0.3s ease-in-out;
  }
  a {
    color: black;
  }
  
`
const EditWrap = styled.div`
  cursor: pointer;
  a {
    color: black;
  }
  svg.MuiSvgIcon-root:hover {
    color: rgb(62, 174, 169);
    transform: translateY(-4px);
    transition: 0.3s ease-in-out;
    
  }
`
const ViewIconWrapper = styled.div`
  cursor: pointer;
  color: black;
  text-decoration:none;
  margin-left: 14px;

  a {
    color: black;
  }

  svg.MuiSvgIcon-root:hover {
    color: rgba(100, 64, 213, 0.7);
    transform: translateY(-4px);
    transition: 0.3s ease-in-out;
  }
`
