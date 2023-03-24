import {styled, Tooltip} from "@mui/material";
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
        onSettingThresholdValue(validValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let validValue = event.target.value === '' ? 0 : Number(event.target.value);
        onSettingThresholdValue(validValue);
    };

    return (
        <Container>
            <Card  sx={{marginLeft: "260px"}} >
                <Box sx={{marginLeft: "2px", marginTop: 0, marginRight: 1, marginBottom: "2px"}} display={"flex"} flexDirection={"row"}
                    alignItems={"center"}
                >
                    <Grid sx={{marginLeft: 0, marginRight: 1}} container spacing={1} alignItems="center">
                        <Grid item xs={4}>
                        <Tooltip title="Action and object confidence" placement="top-start">
                            <Typography id="input-slider" variant="subtitle2" gutterBottom>
                                Confidence
                            </Typography>
                        </Tooltip>
                        </Grid>
                        <Grid item xs={5}sx={{marginLeft: 2 }} >
                            <Slider
                                value={thresholdValue}
                                onChange={handleSliderChange}
                                aria-labelledby="input-slider"
                                step={0.1}
                                min={0}
                                max={1}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Input
                                value={thresholdValue}
                                size="small"
                                onChange={handleInputChange}
                                inputProps={{
                                    step: 0.1,
                                    min: 0,
                                    max: 1,
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