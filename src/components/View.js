import * as React from 'react';
import { Link } from "react-router-dom";
import firebase from 'firebase'
import PropTypes from 'prop-types';

import styled from 'styled-components'
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TextField } from '@mui/material';
import { makeStyles } from "@material-ui/core/styles";
import { Button } from '@mui/material';
import PriceHistoryChart from './PriceHistoryChart'
import QuantityHistoryChart from './QuantityHistoryChart'

const useStyles = makeStyles((theme) => ({
  textField: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function FullWidthTabs({id}) {
  const theme = useTheme();

  const [value, setValue] = React.useState(0);
  const [product, setProduct] = React.useState({});

  const classes = useStyles();

  React.useEffect(() => {
    const getItem = async  () =>{
      const db = firebase.firestore();
      const productFirebase = await db.collection('products').doc(id).get();
      const productData = productFirebase.data();

      setProduct(productData)
    }
    getItem();
  }, []);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabWrapper>    
      <Box sx={{ bgcolor: 'background.paper', width: 700 }}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="preview product" {...a11yProps(0)} />
            <Tab label="price history" {...a11yProps(1)} />
            <Tab label="quantity history" {...a11yProps(2)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <TextField
            className={classes.textField}
            label="Name"
            defaultValue="Default Value"
            variant="standard"
            name='name'
            id="name"
            value={product.name}
            disabled
          />
          <TextField
            className={classes.textField}
            label="Ean"
            name="ean"
            id="ean"
            defaultValue="Default Value"
            value={product.ean}
            disabled
            variant="standard"
          />
          <TextField
            className={classes.textField}
            label="Type"
            name="type"
            id="type"
            defaultValue="Default Value"
            value={product.type}
            disabled
            variant="standard"
          />
          <TextField
            className={classes.textField}
            label="Weight"
            name="weight"
            id="weight"
            defaultValue="Default Value"
            value={product.weight}
            disabled
            variant="standard"
          />
          <TextField
            className={classes.textField}
            label="Color"
            name="color"
            id="color"
            defaultValue="Default Value"
            value={product.color}
            disabled
            variant="standard"
          />
          <TextField
            className={classes.textField}
            label="Price"
            name="price"
            id="price"
            defaultValue="Default Value"
            value={product.price}
            disabled
            variant="standard"
          />
          <TextField
            className={classes.textField}
            label="Quantity"
            name="quantity"
            id="quantity"
            defaultValue="Default Value"
            value={product.quantity}
            disabled
            variant="standard"
          />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <PriceHistoryChart id={id}/>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <QuantityHistoryChart id={id}/>
        </TabPanel>
          <ButtonWrapper>
              <Link to="/">
              <Button variant="contained" color="secondary" size="small">
                Go back
              </Button>
              </Link>
          </ButtonWrapper>
      </Box>
    </TabWrapper>
  );
}


const TabWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 50px;
`

const ButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      text-decoration: none;
      color: transparent;
    }
`