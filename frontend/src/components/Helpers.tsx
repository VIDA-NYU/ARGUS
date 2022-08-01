import * as React from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

export function DeleteRecordingDialog(props) {
  const { onClose, open, ...other } = props;

  const handleCancel = () => {
    onClose(false);
  };

  const handleOk = () => {
    onClose(true);
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>Delete Recording</DialogTitle>
      <DialogContent dividers>
        Are you sure you want to delete this recording?
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          No, cancel!
        </Button>
        <Button onClick={handleOk}>Yes, delete it!</Button>
      </DialogActions>
    </Dialog>
  );
}

export function ConfirmationDeleteDialog(props) {
    const { onClose, value: recordingName, open, ...other } = props;

    const handleOk = () => {
      onClose();
    };

    return (
      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="xs"
        open={open}
      >
        <DialogTitle>Deleted!</DialogTitle>
        <DialogContent dividers>
            Recording {recordingName} was successfully deleted!
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOk}>Yes</Button>
        </DialogActions>
      </Dialog>
    );
  }


export const format = (seconds) => {
    if (isNaN(seconds)) {
      return `00:00`;
    }
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };
  
export const formatTotalDuration = (time: string) => {
    const value = time.split(":");
    if (value[0].substring(0, 2) !== "0" && time.substring(1, 2) !==":") {
      return `${value[0].substring(0, 2)}:${value[1].substring(0, 2)}:${value[2].substring(0, 2)}`;
    }
    return `${value[1].substring(0, 2)}:${value[2].substring(0, 2)}`;
  };