import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Select from "@material-ui/core/Select";
import { useTranslation } from 'react-i18next';
import languages from '../options/Languages';
import config from '../config';


export default function LanguageSelect() {
  const [ open, setOpen ] = React.useState(false);
  const { i18n } = useTranslation();
  const [ language, setLanguage ] = React.useState(languages[i18n.language || config.defaultLanguage]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (event) => {
	const country = languages[event.target.value];
	setLanguage(country);
	i18n.changeLanguage(event.target.value);
  };

  const useStyles = makeStyles((theme) => ({
    select: {
      display: 'flex',
      color: '#fff',
      '& img': {
        width: '24px',
      }
    },
    selectMenu: {
      '& li p': {
        color: "#000",
      }
    },
    selectIcon: {
        fill: 'white',
    },
    selectInput: {
      marginTop: 'auto',
      paddingLeft: theme.spacing(1),
      '& img': {
        width: '24px',
      }
    },
  }));

  const classes = useStyles();

	return (
		<Select disableUnderline
			open={open}
			onClose={handleClose}
			onOpen={handleOpen}
			value={language?.value}
			name="country"
			onChange={handleChange}
			inputProps={{
				id: "open-select",
				classes: { root: classes.select, icon: classes.selectIcon}
			}}
			className={classes.select}
			MenuProps={{ classes: { paper: classes.selectMenu }}}
		>
			{Object.values(languages).map((option) => (
				<MenuItem className={classes.select}
					value={option.value}
					key={option.value}>
					<img src={option.src} alt={option.label} />
					<Typography className={classes.selectInput}>
						{option.label}
					</Typography>
				</MenuItem>
			))}
		</Select>
	)
}