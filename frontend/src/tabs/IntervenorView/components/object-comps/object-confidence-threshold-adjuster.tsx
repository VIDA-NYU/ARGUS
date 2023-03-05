import {styled} from "@mui/material";
import Card from "@mui/material/Card";
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import VolumeUp from '@mui/icons-material/VolumeUp';

const Input = styled(MuiInput)`
  width: 42px;
`;


interface ObjectConfidenceThresholdAdjusterProps {
    thresholdValue: number,
    onSettingThresholdValue: (newValue: number) => void
}

const Container = styled("div")({marginBottom: "10px"});

export default function ObjectConfidenceThresholdAdjuster({
    thresholdValue, onSettingThresholdValue

                                                          }: ObjectConfidenceThresholdAdjusterProps){

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        let validValue = typeof newValue === 'number' ? newValue : 0;
        onSettingThresholdValue(validValue/100);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let validValue = event.target.value === '' ? 0 : Number(event.target.value);
        onSettingThresholdValue(validValue/100);
    };

    const handleBlur = () => {
        if (thresholdValue < 0) {
            onSettingThresholdValue(0);
        } else if (thresholdValue > 1) {
            onSettingThresholdValue(1);
        }
    };

    return (
        <Container>
            <Card>
                <Box sx={{marginLeft: "10px", marginTop: "12px", marginRight: "20px", marginBottom: "7px"}} display={"flex"} flexDirection={"row"}
                    alignItems={"center"}
                >
                    <Typography id="input-slider" gutterBottom>
                        Confidence
                    </Typography>
                    <Grid sx={{marginLeft: 3}} container spacing={2} alignItems="center">
                        <Grid item xs>
                            <Slider
                                value={thresholdValue * 100}
                                onChange={handleSliderChange}
                                aria-labelledby="input-slider"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                value={thresholdValue * 100}
                                size="small"
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                inputProps={{
                                    step: 10,
                                    min: 0,
                                    max: 100,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>

            </Card>
        </Container>
    )
}