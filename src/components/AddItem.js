import React, { useState } from "react";
import firebase from "firebase";
import { useImmer } from "use-immer";

import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ColorPicker from "material-ui-color-picker";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

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

function Edit() {
  const db = firebase.firestore();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [item, editItem] = useImmer({
    name: "",
    type: "",
    weight: "",
    color: "",
    quantity: "",
    price: "",
    ean: "",
  });
  const [errors, editErrors] = useImmer({
    name: false,
    type: false,
    weight: false,
    color: false,
    quantity: false,
    price: false,
  });

  const classes = useStyles();

  const addProduct = async () => {
    setLoading(true);
    const submitErrors = Object.keys(item).map((itemKey) => {
      return checkError(itemKey, item[itemKey]);
    });

    if (submitErrors.some((isError) => isError)) {
      setLoading(false);
      return;
    }
    db.collection("products")
      .add({
        name: item.name,
        type: item.type,
        weight: item.weight,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
        ean: item.ean,
      })
      .then((docRef) => {
        const docId = docRef.id;
        setOpen(true);
      })
      .catch((err) => {
        setOpen(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { value, name, id } = e.target;
    editItem((prev) => {
      return { ...prev, [name]: value };
    });
    checkError(id, value);
  };

  const checkError = (key, value) => {
    const stringErrorKeys = ["name", "type", "color"];
    const isError = stringErrorKeys.includes(key)
      ? value === "" || !isNaN(value)
      : isNaN(value) || value === "";

    editErrors((draft) => {
      draft[key] = isError;
    });

    return isError;
  };
  const handleColorChange = (color) => {
    if (color === undefined) {
      return;
    }

    const isError = !color;

    editErrors((draft) => {
      draft.color = isError;
    });

    editItem({ ...item, color });
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
        value={item.name}
        error={errors.name}
        helperText={errors.name ? "Field cant be empty" : ""}
      />
      <TextField
        className={classes.textField}
        label="type"
        name="type"
        id="type"
        defaultValue="Default Value"
        value={item.type}
        error={errors.type}
        onChange={handleChange}
        helperText={errors.type ? "Field cant be empty" : ""}
      />
      <TextField
        className={classes.textField}
        label="Weight"
        name="weight"
        id="weight"
        defaultValue="Default Value"
        value={item.weight}
        error={errors.weight}
        onChange={handleChange}
        helperText={errors.weight ? "This field must contain only numbers" : ""}
      />
      <TextField
        className={classes.textField}
        label="Ean"
        name="ean"
        id="ean"
        defaultValue="Default Value"
        value={item.ean}
        error={errors.ean}
        onChange={handleChange}
        helperText={errors.ean ? "This field must contain only numbers" : ""}
      />
      <ColorPicker
        className={classes.textField}
        label="Color"
        name="color"
        id="color"
        defaultValue="#000"
        TextFieldProps={{ value: item.color, error: errors.color }}
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
        value={item.quantity}
        onChange={handleChange}
        error={errors.quantity}
        helperText={
          errors.quantity ? "This field must contain only numbers" : ""
        }
      />
      <TextField
        className={classes.textField}
        label="Price"
        name="price"
        id="price"
        defaultValue="Default Value"
        value={item.price}
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
            onClick={addProduct}
            loading={loading}
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
            }}>
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
