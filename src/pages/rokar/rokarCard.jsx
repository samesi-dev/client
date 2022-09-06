
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function BasicCard() {
  return (
    <Card sx={{ minWidth: 275 }} style={{paddingBottom: 10}}>
      <CardContent>
      <Typography variant="h5" component="div">
          Name
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Description
        </Typography>
        <Typography variant="h5" component="div">
          Rs{bull}50000{bull}
        </Typography>
        <Typography variant="body2">
          Fifty Thousand ONly
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Make Corrections</Button>
      </CardActions>
    </Card>
  );
}
