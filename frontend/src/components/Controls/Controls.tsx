import React, { forwardRef, MutableRefObject, useState } from "react";
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from "@mui/icons-material/FastForward";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Popover from "@mui/material/Popover";

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const Controls = forwardRef<MutableRefObject<any>, ControlsProps>(
  (
    {
      onSeek,
      onSeekMouseDown,
      onSeekMouseUp,
      onDuration,
      onRewind,
      onPlayPause,
      onFastForward,
      playing,
      played,
      elapsedTime,
      totalDuration,
      onChangeDispayFormat,
      playbackRate,
      onPlaybackRateChange,
      onToggleFullScreen,
    },
    ref: MutableRefObject<any>
  ) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    return (
      <div ref={ref}>
        <Grid
          container
          direction="column"
          // justify="space-between"
          style={{ flexGrow: 1 }}
        >
          {/* <Grid
            container
            direction="row"
            alignItems="center"
            // justify="space-between"
            // style
            style={{ padding: 16 }}
          >
            <Grid item>
              <Typography variant="h5" style={{ color: "#fff" }}>
                Video Title
              </Typography>
            </Grid>
          </Grid> */}
          {/* <Grid container direction="row" alignItems="center" 
          // justify="center"
          >
            <IconButton
              onClick={onRewind}
              className={"classes.controlIcons"}
              aria-label="rewind"
            >
              <FastRewindIcon
                className={"classes.controlIcons"}
                fontSize="inherit"
              />
            </IconButton>
            <IconButton
              onClick={onPlayPause}
              className={"classes.controlIcons"}
              aria-label="play"
            >
              {playing ? (
                <PauseIcon fontSize="inherit" />
              ) : (
                <PlayArrowIcon fontSize="inherit" />
              )}
            </IconButton>
            <IconButton
              onClick={onFastForward}
              className={"classes.controlIcons"}
              aria-label="forward"
            >
              <FastForwardIcon fontSize="inherit" />
            </IconButton>
          </Grid> */}
          {/* bottom controls */}
          <Grid
            container
            direction="row"
            alignItems="center"
            style={{ padding: 16 }}
          >
            <Grid item xs={12}>
              <input
                type='range' min={0} max={0.999999} step='any'
                style ={{color: "red",  width: "100%"}}
                value={played}
                onMouseDown={onSeekMouseDown}
                onChange={onSeek}
                onMouseUp={onSeekMouseUp}
              />
            </Grid>

            <Grid item>
              <Grid container alignItems="center">
                <IconButton
                  onClick={onPlayPause}
                  className={"classes.bottomIcons"}
                >
                  {playing ? (
                    <PauseIcon fontSize="large" />
                  ) : (
                    <PlayArrowIcon fontSize="large" />
                  )}
                </IconButton>

                <Button
                  variant="text"
                  // onClick={
                  //   onChangeDispayFormat
                  // }
                >
                  <Typography
                    variant="body1"
                    style={{ marginLeft: 16 }}
                  >
                    {elapsedTime} {" / "}  {totalDuration}
                  </Typography>
                </Button>
              </Grid>
            </Grid>

            {/* <Grid item>
               <Button
                onClick={handleClick}
                aria-describedby={id}
                className={"classes.bottomIcons"}
                variant="text"
              >
                <Typography>{playbackRate}X</Typography>
              </Button>
              <Popover
                container={ref.current}
                open={open}
                id={id}
                onClose={handleClose}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Grid container direction="column-reverse">
                  {[0.5, 1, 1.5, 2].map((rate) => (
                    <Button
                      key={rate}
                      onClick={() => onPlaybackRateChange(rate)}
                      variant="text"
                    >
                      <Typography
                        color={rate === playbackRate ? "secondary" : "inherit"}
                      >
                        {rate}X
                      </Typography>
                    </Button>
                  ))}
                </Grid>
              </Popover>
              <IconButton
                onClick={onToggleFullScreen}
                // className={classes.bottomIcons}
              >
                <FullscreenIcon fontSize="large" />
              </IconButton>
            </Grid> */}
          </Grid>
        </Grid>
      </div>
    );
  }
);

type ControlsProps = {
  onSeek: (params: any) => any;
  onSeekMouseDown: (params: any) => any;
  onSeekMouseUp: (params: any) => any;
  onDuration: (params: any) => any;
  onRewind: (params: any) => any;
  onPlayPause: (params: any) => any;
  onFastForward: (params: any) => any;
  onChangeDispayFormat: (params: any) => any;
  onPlaybackRateChange: (params: any) => any;
  onToggleFullScreen: () => void;
  playing: boolean,
  played: number,
  elapsedTime: string,
  totalDuration: string,
  playbackRate: number,
};

export default Controls;