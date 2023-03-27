import * as React from 'react';
import firebase from 'firebase';

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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from "react-i18next";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function ColumnGroupingTable() {
  const db = firebase.firestore();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [products, setProducts] = React.useState([])
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation()

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const columns = [
    { id: 'name', label: `${t("product.name")}`, minWidth: 60 },
    {
      id: 'color',
      label: `${t("product.color")}`,
      align: 'center',
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
      label: `${t("product.ean")}`,
      minWidth: 200,
      align: 'center',
      format: (value) => value,
    },
    {
      id: 'price',
      label: `${t("product.price")}`,
      minWidth: 150,
      align: 'center',
      format: (value) => {
        return `$ ${Number(value, 10).toFixed(2)}`;
      },
    },
    {
      id: 'type',
      label: `${t("product.type")}`,
      align: 'center',
      format: (value) => value
    },
    {
      id: 'quantity',
      label: `${t("product.quantity")}`,
      align: 'center',
      format: (value) => value
    },
    {
      id: 'weight',
      label: `${t("product.weight")}`,
      align: 'center',
      format: (value) => {
        return `${Number(value, 10).toFixed(2)} kg`;
      },
    },
  ];

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  const deleteItem = async (itemId) => {
      const itemToDelete = db.collection('products').doc(itemId);
      await itemToDelete.delete()
      setOpen(true)
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
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
                  <CircularProgress/>
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
                          <Tooltip title={t("buttons.delete")} arrow>
                            <DeleteIcon onClick = {() => deleteItem(row.id)} />
                          </Tooltip>
                        </DeleteWrap>
                        <Snackbar 
                        open={open} 
                        autoHideDuration={3000} 
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                        >
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                          {t("alert.deleted")}
                        </Alert>
                        </Snackbar>
                        <EditWrap>
                          <Link to={`/edit/${row.id}`}>
                            <Tooltip title={t("buttons.edit")} arrow>
                              <EditIcon/>
                            </Tooltip>
                          </Link>
                        </EditWrap>
                        <ViewIconWrapper>
                          <Link to={`/view/${row.id}`}>
                            <Tooltip title={t("buttons.view")} arrow>
                              <OpenInNewIcon/>
                            </Tooltip>
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