import * as React from 'react';
import { useState, useEffect, useReducer } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MuiToggleButton from "@mui/material/ToggleButton";
import { ToggleButtonGroup } from '@mui/material';
import { Divider } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';
import { TextareaAutosize } from '@mui/material';
import { styled } from "@mui/material/styles";
import Grid from '@mui/material/Grid';


export default function FormDialog() {
  // const history = useHistory
  const [open, setOpen] = React.useState(false);
  const [accountType, setAccountType] = React.useState('zameendar');

  const fetchHandler = async () => {
    return await axios.get('https://iqbalsons-api.herokuapp.com/accounts').then((res) => res.data)
  }
  const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0)
  const [accounts, setAccounts] = useState([])
  useEffect(() => {
    fetchHandler().then((data) => setAccounts(data.accounts))
  }, [reducerValue])


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [formData, setFormData] = React.useState({
    name: '', fatherName: '', location: '', phone: '', description: '', guarantor: '', accountType: 'zameendar',
    accountTitle: '', accountNumber: ''
  })
  const [BankShow, setBankShow] = React.useState(true)
  const handleAccountTypeChange = (event, newAccountType) => {
    setAccountType(newAccountType);
    setFormData({ ...formData, ["accountType"]: newAccountType })
    if (event.target.value == "bank") {
      setBankShow(false);
    }
    if (event.target.value != "bank") {
      setBankShow(true);
    }
  };

  const handleInsert = async (e) => {

    e.preventDefault();
    const { name, fatherName, location, phone, description, guarantor, accountType, accountTitle, accountNumber } = formData
    const res = await fetch("https://iqbalsons-api.herokuapp.com/addAccount", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name, fatherName, location, phone, description, guarantor, accountType, accountTitle, accountNumber
      })
    })
    const data = await res.json()
    if (data.status === 422 || !data) {
      window.alert("Invalid Registration")
    } else {
      window.alert("Account Created!")
      handleClose()
      forceUpdate()
      handleClearData()
    }

  }

  let name, value, clearData;
  const handleTyping = (e) => {
    name = e.target.name;
    value = e.target.value;
    setFormData({ ...formData, [name]: value })

  }
  const handleClearData = (e) => {
    clearData = {
      name: '', fatherName: '', location: '', phone: '', description: '', guarantor: '', accountType: 'zameendar',
      accountTitle: '', accountNumber: ''
    }
    setFormData(clearData)
  }
  const ThisIsOnClick = (id) => {
    window.location.assign(`http://localhost:3000/TafseelKhata/` + id);
    console.log(id)
  }


  const ToggleButton = styled(MuiToggleButton)(({ selectedColor }) => ({
    "&.Mui-selected, &.Mui-selected:hover": {
      color: "white",
      backgroundColor: selectedColor
    }
  }));


  return (
    <div>
      <div dir="rtl" className="container" style={{ marginBottom: 10 }}>
        <div style={{ margin: 10, }}>
          <Button style={{ backgroundColor: '#0B2512', color: 'white' }} variant="outlined" onClick={handleClickOpen}>
            نیا کھاتہ
          </Button>
        </div>

        <Divider />
      </div>
      {/* Table Here */}
      <div dir="rtl" style={{ float: 'right' }}>
        <Typography>اندراجات :{accounts.length}</Typography>

        <TableContainer component={Paper} sx={{ maxHeight: 500, maxWidth: 1000, width: 1100 }}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead sx={{ bgcolor: '#0B2512' }} >
              <TableRow  >
                <TableCell><Typography sx={{ color: 'white' }}>آئی ڈی  </Typography></TableCell>
                <TableCell><Typography sx={{ color: 'white' }}>نام</Typography></TableCell>
                <TableCell align="right"><Typography sx={{ color: 'white' }}>بیلنس</Typography></TableCell>
                <TableCell align="right"><Typography sx={{ color: 'white' }}>تفصیل</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account, index) => (
                <TableRow dir="rtl"
                  key={account._id}
                  sx={index % 2 ? { bgcolor: "#D3d3d3" } : { background: "white", '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Typography sx={index % 2 ? { color: '#76A14C' } : { color: 'black' }}>{index + 1}</Typography></TableCell>
                  <TableCell component="th" scope="row">
                    <Typography sx={index % 2 ? { color: '#76A14C' } : { color: 'black' }}>
                      {account.name + " ولد " + account.fatherName + " @ " + account.location}
                    </Typography>
                  </TableCell>
                  <TableCell align="right"><Typography sx={index % 2 ? { color: '#76A14C' } : { color: 'black' }}>{account.balance}</Typography></TableCell>
                  <TableCell align="right"><IconButton size='small' onClick={() => ThisIsOnClick(account._id)}>
                    <EditIcon color="success" />
                  </IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer></div>

      {/* Modal Here */}
      <Dialog open={open} onClose={handleClose} maxWidth="md"  >
        <DialogTitle sx={{ fontfamily: 'PakNastaleeq', color: '#76A14C', textAlign: 'center', bgcolor: '#0B2512' }}><Typography variant='h5'>  نیا اکاؤنٹ </Typography></DialogTitle>
        <DialogContent sx={{ alignContent: 'center', textAlign: 'center', color: '#000000' }}>
          <form method="post">
            {/* This Is For Selecting which Account Type is crediting or Debiting */}
            <div dir="rtl" style={{ margin: 20 }}>
              <Typography style={{ fontfamily: 'PakNastaleeq', marginBottom: '10px', }}>اکاؤنٹ کا انتخاب کریں</Typography>
              <ToggleButtonGroup
                color="primary"
                value={formData.accountType}
                exclusive
                onChange={handleAccountTypeChange}

                name="accountType"
                id="accountType"
                size='large'
              >
                <ToggleButton value="zameendar" selectedColor="#0B2512" >زمیندار</ToggleButton>
                <ToggleButton value="khareedar" selectedColor="#0B2512">خریدار</ToggleButton>
                <ToggleButton value="bank" selectedColor="#0B2512">بینک</ToggleButton>
                <ToggleButton value="inner" selectedColor="#0B2512" >اندرون</ToggleButton>
              </ToggleButtonGroup>
            </div>
            <br />
            <Typography style={{ fontfamily: 'PakNastaleeq', marginBottom: '10px', }}>اکاؤنٹ کی تفصیل</Typography>

            <div>
              <div dir="rtl">
                <Typography style={{ display: 'inline', float: 'right', }}>نام</Typography>
                <TextField
                  style={{ marginBottom: '10px', marginRight: '18px' }}
                  id="name"
                  name="name"
                  size='small'
                  value={formData.name}
                  label="نام"
                  variant="outlined"
                  onChange={handleTyping} />
              </div>

              {BankShow ? <div dir="rtl">
                <Typography style={{ float: 'right', display: 'inline', }}> ولدیت</Typography>
                <TextField
                  style={{ marginBottom: '10px', marginRight: '0px' }}
                  size='small'
                  id="fatherName"
                  name="fatherName"
                  value={formData.fatherName}
                  label="ولدیت"
                  variant="outlined"
                  onChange={handleTyping} />
              </div> : null}

              {BankShow ?
                <div dir="rtl">
                  <Typography style={{ display: 'inline', float: 'right', }}>پتا</Typography>
                  <TextField
                    style={{ marginBottom: '10px', marginRight: '18px' }}
                    size='small'
                    id="location"
                    name="location"
                    value={formData.amount}
                    label="پتا"
                    variant="outlined"
                    onChange={handleTyping} />
                </div> : null}
              <div dir="rtl">
                <Typography style={{ display: 'inline', float: 'right', fontSize: '14px' }}>فون نمبر</Typography>
                <TextField
                  style={{ marginBottom: '10px', marginRight: '-10px' }}
                  id="phone"
                  value={formData.phone}
                  name="phone"
                  label="فون نمبر"
                  variant="outlined"
                  size='small'
                  onChange={handleTyping} />

              </div>
              {BankShow ?
                <div dir="rtl">
                  <Typography style={{ display: 'inline', float: 'right' }}>ضامن</Typography>
                  <TextField
                    style={{ marginBottom: '10px', marginRight: '0px' }}
                    id="guarantor"
                    value={formData.guarantor}
                    name="guarantor"
                    label="ضامن"
                    variant="outlined"
                    size='small'
                    onChange={handleTyping} />
                </div> : null}



              {BankShow ? null :
                <div dir="rtl">
                  <Typography style={{ display: 'inline', float: 'right', fontSize: '14px' }}>اکاؤنٹ <span style={{ display: 'block' }}>کا نام</span></Typography>
                  <TextField
                    style={{ marginBottom: '15px', marginRight: '0px' }}
                    id="accountTitle"
                    value={formData.accountTitle}
                    name="accountTitle"
                    label="اکاؤنٹ کا نام"
                    variant="outlined"
                    size='small'
                    onChange={handleTyping} /> </div>}


              {BankShow ? null :
                <div dir="rtl">
                  <Typography style={{ display: 'inline', float: 'right', fontSize: '14px' }}>اکاؤنٹ <span style={{ display: 'block' }}> نمبر</span></Typography>
                  <TextField
                    style={{ marginBottom: '15px', marginRight: '0px' }}
                    id="accountNumber"
                    value={formData.accountNumber}
                    name="accountNumber"
                    label="اکاؤنٹ نمبر"
                    variant="outlined"
                    size='small'
                    onChange={handleTyping} /> </div>}

              <TextareaAutosize
                minRows={3}
                style={{ width: '224px', marginRight: '30px' }}
                id="descriprion"
                value={formData.description}
                name="description"
                label="Description"
                variant="outlined"
                size='small'
                onChange={handleTyping}>
              </TextareaAutosize>
            </div>

          </form>
        </DialogContent>
        <DialogActions>
          <Button style={{ color: '#878787', fontfamily: 'PakNastaleeq', backgroundColor: '#D9D9D9' }} onClick={handleClearData}>کلئیر</Button>
          <Button style={{ color: '#0B2512', fontfamily: 'PakNastaleeq', backgroundColor: 'white', border: '1px solid #0B2512' }} onClick={handleClose}>کینسل</Button>
          <Button style={{ color: 'white', fontfamily: 'PakNastaleeq', backgroundColor: '#0B2512' }} onClick={handleInsert}>اندراج کریں</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
