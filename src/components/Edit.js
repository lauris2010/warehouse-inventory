import React, { useState } from "react";
import firebase from "firebase";
import { useImmer } from "use-immer";

import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ColorPicker from "material-ui-color-picker";
import InputAdornment from '@mui/material/InputAdornment';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(15),
    marginTop: theme.spacing(6),
  },
  container: {
    marginTop: theme.spacing(),
  },
  textField: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  buttonContainer: {
    margin: "0 auto",
    width: "fit-content",
    marginTop: theme.spacing(5),
  },
  secondButtonContainer: {
    margin: "0 auto",
    width: "fit-content",
    marginTop: theme.spacing(5),
  },
}));

function Edit({ id }) {
  const db = firebase.firestore();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [oldPrice, setOldPrice] = useState(0);
  const [oldQuantity, setOldQuantity] = useState(0);
  const [open, setOpen] = useState(false);

  const [errors, edit] = useImmer({
    name: false,
    type: false,
    weight: false,
    color: false,
    quantity: false,
    price: false,
  });

  const classes = useStyles();

  React.useEffect(() => {
    const getItem = async () => {
      const productFirebaseRef = await db.collection("products").doc(id).get();
      const productData = productFirebaseRef.data();

      setProduct(productData);
      setOldPrice(productData.price);
      setLoading(false);
      setOldQuantity(productData.quantity);
    };

    getItem();
  }, []);

  const handleChange = (e) => {
    const { value, name, id } = e.target;
    const stringErrorKeys = ["name", "type", "color"];
    const isError = stringErrorKeys.includes(id)
      ? value === "" || !isNaN(value)
      : isNaN(value) || value === "";

    edit((draft) => {
      draft[id] = isError;
    });

    const productCopy = { ...product };
    productCopy[name] = value;
    setProduct(productCopy);
  };

  const handleColorChange = (color) => {
    if (color === undefined) {
      return;
    }

    const isError = !color;

    edit((draft) => {
      draft.color = isError;
    });

    setProduct({ ...product, color });
  };

  const updateProduct = async () => {
    setLoading(true);
    setOpen(true);
    await db.collection("products").doc(id).set(product);

    if (oldPrice !== product.price) {
      db.collection("priceHistory").add({
        key: id,
        value: product.price,
        date: new Date(),
      });
    }

    if (oldQuantity !== product.quantity) {
      db.collection("quantityHistory").add({
        key: id,
        value: product.quantity,
        date: new Date(),
      });
    }
    setLoading(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Paper className={classes.paper}>
      <TextField
        className={classes.textField}
        label="Name"
        defaultValue="Default Value"
        variant="standard"
        name="name"
        id="name"
        onChange={handleChange}
        value={product.name}
        error={errors.name}
        helperText={errors.name ? "Field cant be empty" : ""}
      />
      <TextField
        className={classes.textField}
        label="type"
        name="type"
        id="type"
        defaultValue="Default Value"
        value={product.type}
        error={errors.type}
        onChange={handleChange}
        helperText={errors.type ? "Field cant be empty" : ""}
      />
      <TextField
        className={classes.textField}
        label="Weight kg"
        name="weight"
        id="weight"
        defaultValue="Default Value"
        value={product.weight}
        error={errors.weight}
        onChange={handleChange}
        helperText={errors.weight ? "This field must contain only numbers" : ""}
      />
      <ColorPicker
        className={classes.textField}
        label="Color"
        name="color"
        id="color"
        defaultValue="#000"
        TextFieldProps={{ value: product.color, error: errors.color }}
        onChange={handleColorChange}
        error={errors.color}
        helperText={errors.color ? "Field cant be empty" : ""}
      />
      <TextField
        className={classes.textField}
        label="Quantity"
        name="quantity"
        id="quantity"
        defaultValue="number"
        value={product.quantity}
        onChange={handleChange}
        error={errors.quantity}
        helperText={
          errors.quantity ? "This field must contain only numbers" : ""
        }
      />
      <TextField
        className={classes.textField}
        label="Price $"
        name="price"
        id="price"
        defaultValue={0}
        value={product.price}
        InputLabelProps={{ shrink: true }}
        onChange={handleChange}
        error={errors.price}
        helperText={errors.price ? "This field must contain only numbers" : ""}
      />
      <ButtonWrapper>
        <SubmitButton>
          <Button
            disabled={
              Object.values(errors).some((isErrorTrue) => isErrorTrue) ||
              loading
            }
            onClick={updateProduct}
            variant="contained"
            color="primary"
            size="small"
          >
            Submit
          </Button>
          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Alert
              onClose={handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              Submitted!
            </Alert>
          </Snackbar>
        </SubmitButton>
        <GoBackButton>
          <LinkStyle>
            <Link to="/">
              <Button variant="contained" color="secondary" size="small">
                Go back
              </Button>
            </Link>
          </LinkStyle>
        </GoBackButton>
      </ButtonWrapper>
    </Paper>
  );
}

export default Edit;

const LinkStyle = styled.div`
  a {
    text-decoration: none;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
`;

const SubmitButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
`;

const GoBackButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 70px;
`;
