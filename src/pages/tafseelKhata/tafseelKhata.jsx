import { React, useState, useEffect, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Divider, TextareaAutosize } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from 'axios';


const TafseelKhata = () => {
  let n = 0;
  const { id } = useParams()
  const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0)


  const [ledger, setLedger] = useState([{
    name: '', balance: '', phone: '', commission: '',
    TransectionDetails: [{
      amount: '', cashOrMaal: '', date: '', description: '', transectionType: '', _id: ''
    },]
  }])


  const fetchLHandler = async () => {
    return await axios.post('https://iqbalsons-api.herokuapp.com/ledgerSingleAccount', { id }).then((res) => res.data)
  }

  useEffect(() => {
    fetchLHandler().then((data) => setLedger(data.DetailedLedgerOfAccount))
  }, [reducerValue])



  const handleNotesTyping = () => {
    console.log(ledger)
    forceUpdate()
  }
  return (
    <div>

      {/* Card */}

      <Card sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', bgcolor: 'pink', width: '100%' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              ID : {id}
            </Typography>

            <Typography component="div" variant="h5">
              {ledger[0].name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              Balnce : {ledger[0].balance}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              Phone # {ledger[0].phone}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              Commission {ledger[0].commission} %
            </Typography>

          </CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, width: '50%' }}>
            <TextareaAutosize component="div" variant="h5" minRows={8} style={{ width: "90%" }} onChange={handleNotesTyping} />

          </Box>
        </Box>
      </Card>
      <Divider />
      {/* Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead >
            <TableRow >
              <TableCell sx={{ bgcolor: 'lightblue' }}>ID</TableCell>
              <TableCell>Date|Time</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Transection Type</TableCell>
              <TableCell align="right">Debit</TableCell>
              <TableCell align="right">Credit</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
       
            {ledger[0].TransectionDetails.map((t, index) => (
              <TableRow key={t._id}sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{index}</TableCell>
                <TableCell component="th" scope="row">
                  {t.date}
                </TableCell>
                <TableCell component="th" scope="row">
                  {t.description}
                </TableCell>
                <TableCell align="right">{t.transectionType.toUpperCase()}</TableCell>
                <TableCell align="right">{t.transectionType === "debit" ? t.amount : null}</TableCell>
                <TableCell align="right">{t.transectionType === "credit" ? t.amount : null}</TableCell>
                
                <TableCell align="right">{n = n + (t.transectionType === "credit" ? +t.amount : -t.amount)}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{bgcolor:'lightgreen'}}><TableCell  colSpan={6}>Remaining Amount</TableCell><TableCell>{n}</TableCell></TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default TafseelKhata