import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { createTheme, ThemeProvider } from '@mui/material/styles';


export default function ColorToggleButton() {
  const [alignment, setAlignment] = React.useState('Zameendar');

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
    console.log(newAlignment)
  };

  const theme = createTheme({
    palette: {
      neutral: {
        main: '#0B2512',
        contrastText: '#fff',
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <ToggleButtonGroup
        color="neutral"
        value={alignment}
        exclusive
        onChange={handleChange}
      >
        <ToggleButton value="Zameendar">Zameendar</ToggleButton>
        <ToggleButton value="Khareedar">Khareedar</ToggleButton>
        <ToggleButton value="Bank">Bank</ToggleButton>
        <ToggleButton value="Androon">Androon</ToggleButton>
      </ToggleButtonGroup>
    </ThemeProvider>
  );
}
