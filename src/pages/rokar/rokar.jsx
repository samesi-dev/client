import * as React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { useEffect, useState, useReducer } from "react";
import { Divider, Typography } from "@mui/material";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, capitalize, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Stack from '@mui/material/Stack';
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import axios from 'axios';
import moment from 'moment';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary
}));
let date = moment().format('DD/MM/YYYY')
export default function RowAndColumnSpacing() {
  const [open, setOpen] = React.useState(false);
  const [credit_debit, setCredit_debit] = React.useState('');
  const [accountType, setAccountType] = React.useState('zameendar');
  const [title, setTitle] = React.useState("Rokar")

  //Fetching Rokar For given Date


  const fetchRokar = async () => {
    return await axios.post('https://iqbalsons-api.herokuapp.com/ledgerRokar', { date }).then((res) => res.data)
  }
  const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0)
  const [rokarList, setRokarList] = useState([])
  useEffect(() => {
    fetchRokar().then((data) => setRokarList(data.ledger))
  }, [reducerValue])
  const [formData, setFormData] = React.useState({
    description: '', amount: '', accountSelect: '', transectionType: '', accountType: 'zameendar', insertDate: moment().format('DD/MM/YYYY')
  })
  const handleClickOpen = () => {
    setOpen(true);
    setFormData({ ...formData, ['insertDate']: moment().format('DD/MM/YYYY') })
  };

  const handleClose = () => {
    setOpen(false);
  };



  const handleAccountTypeChange = (event, newAccountType) => {
    setAccountType(newAccountType);
    forceUpdateAccountType()
    setFormData({ ...formData, ["accountType"]: newAccountType })
  };


  let name, value;
  const handleTyping = (e) => {
    name = e.target.name;
    value = e.target.value;
    if (name === 'insertDate') {
      let tt = e.target.value.split("-")
      tt = tt[2] + "/" + tt[1] + "/" + tt[0]
      // console.log("date from function" + tt)
      setFormData({ ...formData, [name]: tt })
    }
    else {
      setFormData({ ...formData, [name]: value })
    }
  }
  const handleSelection = (e) => {
    name = e.target.id;
    value = e.target.value;
    value = value.split('|')
    setFormData({ ...formData, [name]: value[1] })
  }
  const handleCreditDebitChange = (event, newCredit_debit) => {
    setCredit_debit(newCredit_debit);
    setTitle(capitalize(newCredit_debit))
    setFormData({ ...formData, ["transectionType"]: newCredit_debit })

  };

  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    }
  }));

  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, .05)"
        : "rgba(0, 0, 0, .03)",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)"
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1)
    }
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)"
  }));

  const [expanded, setExpanded] = React.useState("panel");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  // Here Goes Database Part
  const [reducerValueAccountType, forceUpdateAccountType] = useReducer(x => x + 1, 0)

  const [accounts, setAccounts] = useState([])

  const fetchHandler = async () => {
    return await axios.post('https://iqbalsons-api.herokuapp.com/accountNamesOnly', { accountType }).then((res) => res.data)
  }
  React.useEffect(() => {
    fetchHandler().then((data) => setAccounts(data.details))
  }, [reducerValueAccountType])
  // Insert FUnction

  const handleInsert = async (e) => {

    e.preventDefault();
    const { accountSelect, amount, description, transectionType, insertDate } = formData;
    let cashOrMaal = 'cash';
    const res = await fetch("/addTransection", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        accountSelect, amount, description, transectionType, cashOrMaal, insertDate
      })
    })
    const data = await res.json()
    if (data.status === 422 || !data) {
      window.alert("Invalid Registration")
    } else {
      console.log("Transection Successful!")
      handleClose()
      handleClearData()
      forceUpdate()
    }

  }
  const handleDateChange = (e) => {
    const tt = e.target.value.split("-")
    date = tt[2] + "/" + tt[1] + "/" + tt[0]
    forceUpdate()
  }
  const handleClearData = () => {
    setFormData({ description: '', amount: '', accountSelect: '', transectionType: '', accountType: 'zameendar', insertdate: moment().format('DD/MM/YYYY') })
  }

  return (
    <>

      <div dir="rtl" className="container" style={{ marginBottom: 10 }}>
        {/* Input Modal */}
        <div style={{ margin: 10 }}><div>
          <Button style={{ backgroundColor: '#0B2512', color: 'white', fontSize: 16 }} variant="outlined" onClick={handleClickOpen}>
            نیا مال
          </Button>

          <Dialog dir="rtl" open={open} onClose={handleClose}>
            <DialogTitle dir="rtl" >{title}</DialogTitle>
            <DialogContent >
              {/* DateSelect */}
              <div dir="rtl" style={{ float: "left", margin: 10 }}>
                <Stack component="form" noValidate spacing={3}>
                  <TextField
                    dir="rtl"
                    id="date"
                    label="تاریخ"
                    type="date"
                    name="insertDate"
                    defaultValue={moment().format("YYYY-MM-DD")}
                    onChange={handleTyping}
                    sx={{ width: 220 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />

                </Stack></div>
              {/* This is to select Credit or Debit */}
              <ToggleButtonGroup

                color="primary"
                value={credit_debit}
                exclusive
                onChange={handleCreditDebitChange}
                name="transectionType"
                id="transectionType"
              >
                <ToggleButton value="credit" >جمع</ToggleButton>
                <ToggleButton value="debit" >نام</ToggleButton>
              </ToggleButtonGroup>
              <br />
              {/* This Is For Selecting which Account Type is crediting or Debiting */}
              <ToggleButtonGroup
                color="primary"
                value={accountType}
                exclusive
                onChange={handleAccountTypeChange}
                style={{ marginTop: 20 }}
                name="accountType"
                id="accountType"
              >
                <ToggleButton value="zameendar" selectedColor="#0B2512" >زمیندار</ToggleButton>
                <ToggleButton value="khareedar" selectedColor="#0B2512">خریدار</ToggleButton>
                <ToggleButton value="bank" selectedColor="#0B2512">بینک</ToggleButton>
                <ToggleButton value="inner" selectedColor="#0B2512" >اندرون</ToggleButton>
              </ToggleButtonGroup>

              <Autocomplete
                id="accountSelect"
                sx={{ width: 500 }}
                style={{ marginTop: 20 }}
                options={accounts}
                autoHighlight
                getOptionLabel={(option) => option.label + '  |' + option._id}
                onSelect={handleSelection}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Account Name"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                  />
                )}
              />
              <TextField id="descriprion" value={formData.description} name="description" label="Description" variant="outlined" style={{ marginTop: 20, width: 500 }} onChange={handleTyping} />
              <TextField id="amount" name="amount" value={formData.amount} label="Amount" variant="outlined" style={{ marginTop: 20, width: 500 }} onChange={handleTyping} />
              {/* <TextField id="amountInWords" name="amountInWords"formData={user.amountInWords} label="Amount In Words" variant='outlined' inputProps={{ readOnly: true }} style={{ marginTop: 20, width: 500 }} onClick={handleTyping} /> */}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClearData}>Clear Data</Button>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleInsert}>Insert Data</Button>
            </DialogActions>
          </Dialog>
        </div></div>
        <Divider />
        {/* Date */}
        <div dir="rtl" style={{ float: "left", margin: 10 }}>
          <Stack component="form" noValidate spacing={3}>
            <TextField
              id="dateField"
              label="Rokar Date"
              type="date"
              defaultValue={moment().format("YYYY-MM-DD")}
              onChange={handleDateChange}
              sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
            />

          </Stack></div>
        {/* Search */}
        <div style={{ float: "Right" }}><Box sx={{ "& > :not(style)": { m: 1 } }}>
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField id="input-with-sx" label="Search" variant="outlined" />
          </Box>
        </Box></div>
      </div>
      {/* Accrodon */}
      <Box sx={{ width: "100%" }}>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Item style={{ backgroundColor: "red" }}>

              <Typography variant="h3" component="div">Credit</Typography>
              <div>
                {rokarList.map((list, id) => (
                  list.transectionType === "credit" ?

                    <Accordion expanded={expanded === "panel_" + id} onChange={handleChange("panel_" + id)}>
                      <AccordionSummary aria-controls={"panel_" + id + "d-content"} id={"panel_" + id + "panel1d-header"}>
                        <Typography>{id}</Typography>

                        <Typography style={{ backgroundColor: 'lightgreen' }}>
                          {" ** "}
                          {list.accountDetails[0].accountType === 'bank' ?
                            list.accountDetails[0].name + " | " + list.accountDetails[0].accountTitle
                            : list.accountDetails[0].name + " S/O " + list.accountDetails[0].fatherName + " @ " +
                            list.accountDetails[0].address + " ** "}
                        </Typography>
                        <Typography style={{ backgroundColor: 'pink', paddingLeft: 30 }}>{" Rs: " + list.amount} </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>{list.description !== "" ? list.description : null}</Typography>
                        <Typography><small>Tracking Id: {list._id}</small></Typography>
                        <Typography><small>{"Account Type: " + list.accountDetails[0].accountType}</small></Typography>
                      </AccordionDetails>
                    </Accordion>
                    : null
                ))}
              </div>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item style={{ backgroundColor: "blue" }}>
              <Typography variant="h3" component="div">Debit</Typography>
              <div>

                {rokarList.map((list, id) => (
                  list.transectionType === "debit" ?

                    <Accordion expanded={expanded === "panel_" + id} onChange={handleChange("panel_" + id)}>
                      <AccordionSummary aria-controls={"panel_" + id + "d-content"} id={"panel_" + id + "panel1d-header"}>
                        <Typography>{id}</Typography>
                        <Typography style={{ backgroundColor: 'lightgreen' }}>{" ** "}{list.accountDetails[0].accountType === 'bank' ?
                          list.accountDetails[0].name + " | " + list.accountDetails[0].accountTitle
                          : list.accountDetails[0].name + " S/O " + list.accountDetails[0].fatherName + " @ " +
                          list.accountDetails[0].address + " ** "} </Typography>
                        <Typography style={{ backgroundColor: 'lightblue', paddingLeft: 30 }}>{" Rs: " + list.amount} </Typography>
                      </AccordionSummary>
                      <AccordionDetails>

                        <Typography>{list.description !== "" ? list.description : null}</Typography>
                        <Typography><small>Tracking Id: {list._id}</small></Typography>
                        <Typography><small>{"Account Type: " + list.accountDetails[0].accountType}</small></Typography>


                      </AccordionDetails>
                    </Accordion>
                    : null
                ))}
              </div>

            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
