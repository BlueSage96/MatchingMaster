import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";

function VolumeSlider({volume, setVolume}) {
  const handleChange = (__, newvolume) => {
     if (typeof newvolume === "number" && isFinite(newvolume)) {
        setVolume(newvolume);
     }
  };
    
  const VolumeTicks = [{
      value: 25,
      label: '25'
    },
    {
      value: 50,
      label: '50'
    },
    {
        value: 75,
        label: '75'
    },
    {
        value: 100,
        label: '100'
    },
  ]
  return (
    <> 
    <Box sx={{width: 300}}>
    <Stack spacing={2} direction="row" sx={{ alignItems: "center", mb: 1 }}>
        <VolumeDown sx={{filter: "drop-shadow(0 0 6px rgba(0,0,0,0.6))",
            opacity: volume < 50 ? 1 : 0.5, transition: "opacity 0.3s ease-in-out"}}/>
        <Slider
        aria-label="Volume"
        min={0}
        max={100}
        value={volume}
        marks={VolumeTicks}
        valueLabelDisplay="auto"
        onChange={handleChange}
        >
        
        </Slider>
        <VolumeUp sx={{filter: "drop-shadow(0 0 6px rgba(0,0,0,0.6))",
            opacity: volume > 50 ? 1 : 0.5, transition: "opacity 0.3s ease-in-out"}}/>
    </Stack>
    </Box>
    </>
  );
}

export default VolumeSlider;
