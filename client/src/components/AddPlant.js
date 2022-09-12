import {
  Stack,
  Box,
  Modal,
  Snackbar,
  Alert,
  Typography,
  TextField,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import UloadImage from "./UploadImage";

const AddPlant = () => {
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            gap={3}
          >
            <div>
              <Typography>Add A Plant</Typography>
              <UploadImage />

              <TextField
                sx={{ marginTop: "15px" }}
                type="text"
                required
                label="Plant Name (Required)"
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
              <TextField
                sx={{ marginTop: "10px" }}
                type="text"
                label="Location"
                onChange={(event) => {
                  setLocation(event.target.value);
                }}
              />
            </div>
            <div>
              <Typography variant="body1" color="text.primary">
                Last Watered
              </Typography>
              <Typography variant="body2" color="text.secondary">
                If left blank, today's date will be used
              </Typography>
              <input
                type="date"
                id="start"
                name="trip-start"
                min="2022-01-01"
                max="2022-12-31"
                onChange={(e) => {
                  formatDate(e.target.value);
                }}
              ></input>
            </div>
            {/* <Button onClick={(event)=>{showDate()}}>test</Button> */}
            <div>
              <Button
                sx={{ marginRight: "5px" }}
                variant="text"
                color="success"
                onClick={updatePlant}
              >
                Add
              </Button>
              <Button variant="text" color="error" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default AddPlant;
