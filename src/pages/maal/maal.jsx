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
  color: theme.palette.text.secondary,
}));
let date = moment().format('DD/MM/YYYY')
export default function RowAndColumnSpacing() {
  const [open, setOpen] = React.useState(false);
  const [sellerAccountType, setSellerAccountType] = React.useState('zameendar');
  const [buyerAccountType, setBuyerAccountType] = React.useState('khareedar');

  // Accrodon
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

  // 
  let counted = false
  let buyers = []

  //Fetching Maal For given Date


  const fetchMaal = async () => {
    return await axios.post('https://iqbalsons-api.herokuapp.com/ledgerMaal', { date }).then((res) => res.data)
  }
  const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0)
  const [maalList, setMaalList] = useState([])

  useEffect(() => {
    fetchMaal().then((data) => {

      setMaalList(data.ledger)
    })

  }, [reducerValue])

  const [formData, setFormData] = React.useState({
    sellerAccountType: '', buyerAccountType: '', sellerAccountSelect: '', buyerAccountSelect: '', cropName: '', detailedWeight: '', calculatedWeight: ''
    , rate: '', netAmount: '', commission: '', commissionAmount: '', chungi: '', munshiayana: ''
    , totalCommission: '', grossAmount: '', insertDate: moment().format('DD/MM/YYYY')
  })
  const handleClickOpen = () => {
    setOpen(true);
    setFormData({ ...formData, ['insertDate']: moment().format('DD/MM/YYYY') })
  };

  const handleClose = () => {
    setOpen(false);
  };



  const handleSellerAccountTypeChange = (event, newAccountType) => {
    setSellerAccountType(newAccountType)
    forceUpdateSellerAccountType()
    setFormData({ ...formData, ["sellerAccountType"]: newAccountType })
  };
  const handleBuyerAccountTypeChange = (event, newAccountType) => {
    setBuyerAccountType(newAccountType)
    forceUpdateBuyerAccountType()
    setFormData({ ...formData, ["buyerAccountType"]: newAccountType })
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
    // console.log(name,value)
    setFormData({ ...formData, [name]: value[1] })
  }


  const [expanded, setExpanded] = React.useState("panel");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  // Here Goes Database Part
  const [reducerValueSellerAccountType, forceUpdateSellerAccountType] = useReducer(x => x + 1, 0)
  const [reducerValueBuyerAccountType, forceUpdateBuyerAccountType] = useReducer(x => x + 1, 0)

  const [sellerAccounts, setSellerAccounts] = useState([])
  const [buyerAccounts, setBuyerAccounts] = useState([])

  const fetchSellerHandler = async () => {
    return await axios.post('https://iqbalsons-api.herokuapp.com/accountNamesOnly', { sellerAccountType }).then((res) => res.data)
  }
  const fetchBuyerHandler = async () => {
    return await axios.post('https://iqbalsons-api.herokuapp.com/accountNamesOnly', { buyerAccountType }).then((res) => res.data)
  }
  React.useEffect(() => {
    fetchSellerHandler().then((data) => setSellerAccounts(data.details))
  }, [reducerValueSellerAccountType])


  React.useEffect(() => {
    fetchBuyerHandler().then((data) => setBuyerAccounts(data.details))
  }, [reducerValueBuyerAccountType])
  // Insert FUnction

  const handleInsert = async (e) => {
    console.log(formData)
    e.preventDefault();
    const { sellerAccountSelect, buyerAccountSelect, cropName, detailedWeight, calculatedWeight
      , rate, netAmount, commission, commissionAmount, chungi, munshiayana
      , totalCommission, grossAmount, insertDate } = formData;
    let cashOrMaal = 'maal';
    const res = await fetch("/addMaalTransection", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sellerAccountSelect, buyerAccountSelect, cropName, detailedWeight, calculatedWeight
        , rate, netAmount, commission, commissionAmount, chungi, munshiayana
        , totalCommission, grossAmount, insertDate, cashOrMaal
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

      <div className="container" style={{ marginBottom: 10 }}>
        {/* Input MAAL */}
        <div style={{ margin: 10 }}><div>
          <Button variant="outlined" onClick={handleClickOpen}>
            New Maal
          </Button>
          <Dialog open={open} onClose={handleClose} maxWidth="lg" >
            <DialogTitle >New Maal Entry</DialogTitle>
            <DialogContent >
              {/* DateSelect */}
              <div style={{ backgroundColor: "pink" }}>
                <div style={{ margin: 10, backgroundColor: "green", }}>
                  <Stack component="form" noValidate spacing={3}>
                    <TextField
                      id="date"
                      label="Insert Date"
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
                <div style={{ width: "100%", height: 50, border: 'dotted 1px' }}>

                </div>
              </div>
              <Divider variant="fullWidth" />

              <div style={{ border: "solid 1px", float: 'left' }} >
                {/*Seller Account Type Sellect*/}

                <ToggleButtonGroup
                  color="error"
                  value={sellerAccountType}
                  exclusive
                  onChange={handleSellerAccountTypeChange}
                  style={{ margin: 5, }}
                >
                  <ToggleButton value="zameendar" >Zameendar</ToggleButton>
                  <ToggleButton value="khareedar" >Khareedar</ToggleButton>
                  <ToggleButton value="bank" >Bank</ToggleButton>
                  <ToggleButton value="inner" >Androon</ToggleButton>
                </ToggleButtonGroup>

                {/* Seller */}
                <Autocomplete
                  id="sellerAccountSelect"
                  sx={{ width: 500 }}
                  style={{ margin: 20, }}
                  options={sellerAccounts}
                  autoHighlight
                  getOptionLabel={(option) => option.label + '  |' + option._id}
                  onSelect={handleSelection}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Seller Name"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
              </div>
              <div style={{ border: "solid 1px", float: 'right' }}>
                {/* Buyer Account Type Sellect */}

                <ToggleButtonGroup
                  color="error"
                  value={buyerAccountType}
                  exclusive
                  onChange={handleBuyerAccountTypeChange}
                  style={{ margin: 5, }}

                >
                  <ToggleButton value="zameendar" >Zameendar</ToggleButton>
                  <ToggleButton value="khareedar" >Khareedar</ToggleButton>
                  <ToggleButton value="bank" >Bank</ToggleButton>
                  <ToggleButton value="inner" >Androon</ToggleButton>
                </ToggleButtonGroup>
                <br />

                {/* Buyer */}
                <Autocomplete
                  id="buyerAccountSelect"
                  sx={{ width: 500 }}
                  style={{ margin: 20, }}
                  options={buyerAccounts}
                  autoHighlight
                  getOptionLabel={(option) => option.label + '  |' + option._id}
                  onSelect={handleSelection}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Buyer Name"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                      }}
                    />
                  )}
                />
              </div>
              <TextField id="cropName" value={formData.description} name="cropName" label="Crop Name" variant="outlined" style={{ margin: 20, width: 200 }} onChange={handleTyping} />
              <TextField id="detailedWeight" name="detailedWeight" value={formData.detailedWeight} label="Detailed Weight" variant="outlined" style={{ margin: 20, width: 300 }} onChange={handleTyping} />
              <TextField id="calculatedWeight" name="calculatedWeight" value={formData.calculatedWeight} label="Calculated Weight" variant="outlined" style={{ margin: 20, width: 300 }} onChange={handleTyping} />
              <TextField id="rate" name="rate" value={formData.rate} label="Rate" variant="outlined" style={{ margin: 20, width: 150 }} onChange={handleTyping} />
              <TextField id="netAmount" name="netAmount" value={formData.netAmount} label="Net Amount" variant="outlined" style={{ margin: 20, width: 300 }} onChange={handleTyping} />
              <TextField id="commission" name="commission" value={formData.commission} label="Commission %" variant="outlined" style={{ margin: 20, width: 150 }} onChange={handleTyping} />
              <TextField id="commissionAmount" name="commissionAmount" value={formData.commissionAmount} label="Commission Amount" variant="outlined" style={{ margin: 20, width: 300 }} onChange={handleTyping} />
              <TextField id="chungi" name="chungi" value={formData.chungi} label="Chungi" variant="outlined" style={{ margin: 20, width: 150 }} onChange={handleTyping} />
              <TextField id="munshiayana" name="munshiayana" value={formData.munshiayana} label="Munshiayana" variant="outlined" style={{ margin: 20, width: 150 }} onChange={handleTyping} />
              <TextField id="totalCommission" name="totalCommission" value={formData.totalCommission} label="Total Commission" variant="outlined" style={{ margin: 20, width: 300 }} onChange={handleTyping} />
              <TextField id="grossAmount" name="grossAmount" value={formData.grossAmount} label="Gross Amount" variant="outlined" style={{ margin: 20, width: 300 }} onChange={handleTyping} />
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
        <div style={{ float: "left", margin: 10 }}>
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

              <Typography variant="h3" component="div">Seller</Typography>
              <div>
                {maalList.map((list, id) => (
                  <Accordion expanded={expanded === "panel_" + id} onChange={handleChange("panel_" + id)}>
                    <AccordionSummary aria-controls={"panel_" + id + "d-content"} id={"panel_" + id + "panel1d-header"}>
                      <Typography>{id}</Typography>

                      <Typography style={{ backgroundColor: 'lightgreen' }}>
                        {" ** "}
                        {list.seller[0].name + " S/O " + list.seller[0].fatherName + " @ " +
                          list.seller[0].address + " ** "}
                      </Typography>
                      <Typography>{list.cropName}</Typography>
                      <Typography>{"~/" + list.grossAmount + "/="}</Typography>

                      {/* <Typography style={{ backgroundColor: 'pink', paddingLeft: 30 }}>{" Rs: " + list.amount} </Typography> */}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{"Weight: " + list.calculatedWeight + "kgs   Rate=/" + list.rate + "/="}</Typography>
                      <Typography>{"Gross Amount: " + list.netAmount}</Typography>
                      <Typography>{"TotalCommission: =/" + list.totalCommission + "/= (" + list.commissionAmount + "+" + list.chungi + "+" + list.munshiayana + ")"}</Typography>
                      <Typography>{"Remaining Amount: " + list.grossAmount}</Typography>
                      <Typography><small>Detailed Weight: {list.detailedWeight}</small></Typography>
                      <Typography><small>Tracking Id: {list._id}</small></Typography>
                      <Typography><small>{"Account Type: " + list.seller[0].accountType}</small></Typography>
                    </AccordionDetails>
                  </Accordion>

                ))}
              </div>
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item style={{ backgroundColor: "blue" }}>
              <Typography variant="h3" component="div">Buyer</Typography>
              <div>

                {/* {countBuyers.map((list, id) => { */}


                {/* // <Accordion expanded={expanded === "panel_buyer" + id} onChange={handleChange("panel_buyer" + id)}>
                  //   <AccordionSummary aria-controls={"panel_buyer" + id + "d-content"} id={"panel_buyer" + id + "panel1d-header"}>
                  //     <Typography>{list}</Typography>
                  //     <Typography style={{ backgroundColor: 'pink' }}>
                  //     {list.buyer[0].name} </Typography>

                  //     <Typography style={{ backgroundColor: 'lightblue', paddingLeft: 30 }}>{"  ~"+list.cropName+" Rs:" + list.netAmount+"/="} </Typography>
                  //   </AccordionSummary>
                  //   <AccordionDetails>

                  //   </AccordionDetails>
                  // </Accordion> */}

                {/* })} */}
              </div>

            </Item>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
