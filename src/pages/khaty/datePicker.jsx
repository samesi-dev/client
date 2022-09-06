import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export default function NativePickers() {
  return (
    <Stack component="form" noValidate spacing={3}>
      <TextField
        id="date"
        label="Rokar Date"
        type="date"
        defaultValue="2017-05-24"
        sx={{ width: 220 }}
        InputLabelProps={{
          shrink: true,
        }}
      />
    
    </Stack>
  );
}
