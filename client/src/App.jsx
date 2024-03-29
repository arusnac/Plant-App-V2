import "./App.css";
import { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { AccountContext } from "./components/Account";
import styles from "./App.module.css";
import UploadImage from "./components/UploadImage";
import { toggleStatus, setUsername } from "./redux/UserSlice";
import Button from "@mui/material/Button";
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
} from "@mui/material";
import PlantCard from "./components/PlantCard";
import Nav from "./components/Nav";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import Footer from "./components/Footer";
import { setImagePath } from "./redux/UserSlice";
import "./constants";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BASE_URL } from "./constants";
import { useParams } from "react-router-dom";

const App = () => {
  const [plantList, setPlantList] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [waterDate, setWaterDate] = useState("");
  const [valueDate, setValueDate] = useState("");

  let params = useParams();

  //Functionallity to handle the sort menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openSort = Boolean(anchorEl);
  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSortClose = () => {
    setAnchorEl(null);
  };

  //Sort the plants alphabetically or by earliest watering date
  const handleSort = (sortBy) => {
    if (sortBy === "name")
      plantList.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "watering")
      plantList.sort((a, b) => a.watered[0].localeCompare(b.watered[0]));
    setPlantList(plantList);
    handleSortClose();
  };

  const { getUser } = useContext(AccountContext);
  const user = getUser();

  const dispatch = useDispatch();

  //Get the image path from UploadImage
  const PATH = useSelector((state) => state.user.value);

  //If the user is logged in get their plant collection on initial loading
  useEffect(() => {
    if (user) {
      //If the url contains optional parameters (ie "kitchen", "bedroom") get the appropriate plants from MongoDB
      //Else get all the users plants
      if (params.option) {
        Axios.get(BASE_URL + "/user", {
          params: {
            username: user.username,
            option: true,
            attribute: params.option,
          },
        }).then((response) => {
          setPlantList(response.data);
        });
      } else
        Axios.get(BASE_URL + "/user", {
          params: { username: user.username },
        }).then((response) => {
          setPlantList(response.data.plants);
        });
    } else {
      console.log("Error: can't find user");
    }
  }, []);

  //Pass the state of the delete confirmation window to the plant card in order to close it
  //after deletion
  const [confirmationWindow, setConfirmationWindow] = useState(false);

  //Remove plant after confirmation from the user
  const deletePlantCard = (e) => {
    Axios.post(BASE_URL + "/user/delete", {
      id: e.target.value,
      username: user.username,
      toDelete: "plant",
    }).then((response) => {
      handleClick("Plant removed!", "warning");
    });
    //Find index of selected plant to delete
    const index = plantList.map((x) => x._id).indexOf(e.target.value);
    if (index !== -1) {
      setPlantList([
        ...plantList.slice(0, index),
        ...plantList.slice(index + 1, plantList.length),
      ]);
      setConfirmationWindow(false);
    }
  };

  //Handles the alert when plant is added
  //plus the style of the message
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const [openSnack, setOpenSnack] = useState(false);
  const handleClick = (message, sev) => {
    setAlertMessage(message);
    setSeverity(sev);
    setOpenSnack(true);
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };

  //Toggles the add plant modal modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Add plant to the user collection in mongoDB then update the list to
  //rerender the the plant cards
  const updatePlant = () => {
    if (!name.length > 0 || !location.length > 0)
      return alert("Please fill all requried fields.");
    else {
      //Set the watering date if the user manually inputs it
      //Else get todays date and add it to the plant, append a 0 infront of the month
      //to make the dates uniform
      let watered;
      if (waterDate.length > 0) watered = waterDate;
      else {
        let date = new Date().toLocaleDateString();
        if (Number(date[0]) < 10) date = `0` + date;
        watered = date;
      }

      let imagePath = PATH.imagePath;
      Axios.post(
        BASE_URL + "/user/update",
        { name, location, watered, image: imagePath },
        {
          params: { username: user.username },
        }
      ).then((response) => {
        setPlantList([
          ...plantList,
          { name, location, watered, image: imagePath, _id: response.data._id },
        ]);
        handleClose();
        //Clear the image path after the image has been sucessfully uploaded
        //TODO: Check if related to bug with image upload not being consistent
        dispatch(setImagePath(""));
        handleClick("Plant Added!", "success");
      });
    }
  };

  //Convert the date from the date picker to match desired output
  //TODO: Review for simpler method
  const formatDate = (date) => {
    setValueDate(date);
    let [year, month, day] = date.split("-");
    if (month.length === 1) {
      month = `0` + month;
    }
    setWaterDate(`${month}/${day}/${year}`);
  };

  //style for modal
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Box sx={{ height: "100%" }}>
        <Nav />

        {!open && (
          <Box
            sx={{
              position: "fixed",
              marginBottom: { xs: "0", md: "40px" },
              bottom: "0",
              right: "0",
              zIndex: "1",
            }}
          >
            <IconButton
              variant="contained"
              color="success"
              onClick={handleOpen}
            >
              <AddCircleIcon sx={{ fontSize: { md: 60, xs: 42 } }} />
            </IconButton>
          </Box>
        )}

        <div className="App">
          <Button
            id="basic-button"
            aria-controls={openSort ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openSort ? "true" : undefined}
            onClick={handleSortClick}
          >
            Sort
          </Button>
          <Button href="/plants">View All</Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openSort}
            onClose={handleSortClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => handleSort("name")}>By Name</MenuItem>
            <MenuItem onClick={() => handleSort("watering")}>
              By Watering
            </MenuItem>
          </Menu>
          <Snackbar
            open={openSnack}
            autoHideDuration={6000}
            onClose={handleSnackClose}
          >
            <Alert
              onClose={handleSnackClose}
              severity={severity}
              sx={{ width: "100%" }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>

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

          <div className={styles.plantContainer}>
            {!plantList.length > 0 && (
              <Typography>Press the green plus icon to add plants</Typography>
            )}
            {plantList.map((plants) => {
              return (
                <PlantCard
                  size={[275, 275, 280]}
                  open={confirmationWindow}
                  deletePlantCard={deletePlantCard}
                  key={plants._id}
                  id={plants._id}
                  name={plants.name}
                  image={plants.image}
                  location={plants.location}
                  watered={plants.watered}
                  userName={user.username}
                />
              );
            })}
          </div>
        </div>
      </Box>

      <Footer />
    </>
  );
};

export default App;
