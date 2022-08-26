import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AccountContext } from "./Account";
import Axios from "axios";
import Nav from "./Nav";
import Note from "./Note";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { createFilterOptions } from "@mui/material/Autocomplete";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  Box,
  Button,
  CardActions,
  TextField,
  Stack,
  Autocomplete,
  Modal,
} from "@mui/material";

import Footer from "./Footer";
import { BASE_URL } from "../constants";
import UploadImage from "./UploadImage";

const filter = createFilterOptions();

const PlantPage = () => {
  const PATH = useSelector((state) => state.user.value.imagePath);
  //Show the input fields when the user selects the edit button
  const [editing, setEditing] = useState(false);

  //Contains the user added notes
  const [noteList, setNoteList] = useState([]);

  //States for the user added notes
  const [titleValue, setTitleValue] = useState("");
  const [noteBodyValue, setNoteBodyValue] = useState("");

  //Set state to the specific plant loaded
  const [plant, setPlant] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [imagePath, setImage] = useState("");
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  //State for updating the plants location
  const [valueLocation, setValueLocation] = useState(null);

  //Hold plant info and reRender on edits
  const [plantName, setPlantName] = useState("");

  //State and function to manage the modals
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  //Close the note deletion window after confimration
  const [confimationWindow, setConfirmationWindow] = useState(false);

  let params = useParams();

  const { getUser } = useContext(AccountContext);
  const user = getUser();
  const username = user.username;

  useEffect(() => {
    Axios.get(BASE_URL + "/user/plant", {
      params: {
        username: username,
        id: params.plantId,
      },
    }).then((response) => {
      setPlant(response.data);
      setPlantName(response.data.name);
      setNoteList(response.data.notes);
      setValueLocation(response.data.location);
      setImage(response.data.image);
    });
  }, []);

  const saveNote = (noteTitle, noteBody) => {
    if (!noteBody.length > 0) alert("Please fill out the required field");
    else {
      Axios.post(BASE_URL + "/user/note", {
        id: plant._id,
        noteTitle,
        noteBody,
        username,
        toDo: "add",
      }).then((response) => {
        if (noteList)
          setNoteList((noteList) => [...noteList, { noteTitle, noteBody }]);
        else setNoteList([{ noteTitle, noteBody }]);
        setTitleValue(noteTitle);
        setNoteBodyValue(noteBody);
        handleClose(false);
      });
    }
  };

  //Edit the plants name
  const editInfo = (name, location) => {
    Axios.post(
      BASE_URL + "/user/edit",
      { id: plant._id, name: plantName, location: valueLocation },
      {
        params: {
          username: username,
          id: plant._id,
        },
      }
    ).then((response) => {
      setPlantName(name);
      setValueLocation(location);
      handleCloseEdit(false);
      setEditing(false);
    });
  };

  //After confimation on the note deletion update noteList
  const deleteNoteConfirmation = (idx) => {
    Axios.post(BASE_URL + "/user/delete", {
      username,
      idx,
      id: plant._id,
      toDelete: "note",
    }).then((response) => {
      setConfirmationWindow(false);
    });
    if (idx !== -1) {
      setNoteList([
        ...noteList.slice(0, idx),
        ...noteList.slice(idx + 1, noteList.length),
      ]);
    }
  };

  const editImage = (PATH) => {
    //const id = plantId;
    Axios.post(
      BASE_URL + "/user/editImage",
      { id: plant._id, imagePath: PATH },
      {
        params: {
          username: username,
          id: plant._id,
        },
      }
    ).then((response) => {
      setImage(PATH);
      //dispatch(setImagePath(""));
      setOpenEdit(false);
    });
  };

  //style for modal
  const style = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
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

  //Test data for the input boxes
  const plantData = [
    { name: "AFRICAN VIOLET PLANT" },
    { name: "AGAVE PLANT" },
    { name: "ALOCASIA" },
    { name: "ALOCASIA – JEWEL ALOCASIA" },
    { name: "ALOE VERA PLANT" },
    { name: "AMARYLLIS" },
    { name: "ANGEL WING BEGONIA" },
    { name: "ANTHURIUM" },
    { name: "ARALIA PLANT" },
    { name: "ARALIA PLANT – BALFOUR" },
    { name: "ARECA PALM" },
    { name: "ARROWHEAD PLANT" },
    { name: "ASPARAGUS FERN" },
    { name: "AZALEA" },
    { name: "BABY’S TEARS PLANT" },
    { name: "BAMBOO PALM" },
    { name: "BEGONIA PLANT" },
    { name: "TERRARIUM" },
    { name: "WANDERING JEW PLANT" },
    { name: "YUCCA PLANT" },
    { name: "ZAMIOCULCAS ZAMIIFOLIA - ZZ PLANT" },
    { name: "ZEBRA PLANT" },
  ];

  const options = [
    { location: "Bedroom" },
    { location: "Kitchen" },
    { location: "Living Room" },
    { location: "Dining Room" },
  ];

  return (
    <>
      <Box sx={{ height: "100%" }}>
        <Nav />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
            mb: 2,
          }}
        >
          <Card sx={{ maxWidth: { xs: 345, md: 650 } }}>
            <CardMedia
              component="img"
              image={
                imagePath !== "test" && imagePath !== ""
                  ? imagePath
                  : "https://dummyimage.com/345x345/696969/696969"
              }
              alt={plant.image}
            />
            <CardContent>
              {/* Components to display while editing the name and location */}
              {editing ? (
                <>
                  <Stack spacing={2}>
                    <Autocomplete
                      id="free-solo-demo"
                      freeSolo
                      options={plantData.map((option) => option.name)}
                      renderInput={(params) => (
                        <TextField label="Name" {...params} />
                      )}
                      value={plantName}
                      inputValue={plantName}
                      sx={{ width: "inherit" }}
                      onInputChange={(event, newInputValue) => {
                        setPlantName(newInputValue);
                        // editInfo(id, newInputValue)
                      }}
                      onKeyDown={(event, newInputValue) => {
                        if (event.key === "Enter") {
                          // Prevent's default 'Enter' behavior.
                          editInfo(plantName, valueLocation);
                          //editLocation(valueLocation);
                          setEditing(false);
                        }
                      }}
                    />
                    <Autocomplete
                      value={valueLocation}
                      onInputChange={(event, newLocation) => {
                        setValueLocation(newLocation);
                      }}
                      onChange={(event, newValue) => {
                        if (typeof newValue === "string") {
                          setValueLocation(newValue);
                        } else if (newValue && newValue.inputValue) {
                          // Create a new value from the user input
                          setValueLocation(newValue.location);
                        } else {
                          setValueLocation(newValue.location);
                        }
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        // Suggest the creation of a new value
                        const isExisting = options.some(
                          (option) => inputValue === option.title
                        );
                        if (inputValue !== "" && !isExisting) {
                          filtered.push({
                            inputValue,
                            title: `Add "${inputValue}"`,
                          });
                        }

                        return filtered;
                      }}
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      id="free-solo-with-text-demo"
                      options={options}
                      getOptionLabel={(option) => {
                        // Value selected with enter, right from the input
                        if (typeof option === "string") {
                          return option;
                        }
                        // Add "xxx" option created dynamically
                        if (option.inputValue) {
                          return option.inputValue;
                        }
                        // Regular option
                        return option.location;
                      }}
                      renderOption={(props, option) => (
                        <li {...props}>{option.location}</li>
                      )}
                      sx={{ width: "inherit" }}
                      freeSolo
                      renderInput={(params) => (
                        <TextField {...params} label="Location" value="test" />
                      )}
                    />
                  </Stack>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "rows",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography gutterBottom variant="h5" component="div">
                      {plantName}
                    </Typography>
                    {!editing && (
                      <div>
                        <IconButton onClick={() => setEditing(true)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="success" onClick={handleOpenEdit}>
                          <AddPhotoAlternateIcon />
                        </IconButton>
                      </div>
                    )}
                  </Box>
                  <Typography
                    fontWeight={700}
                    variant="body1"
                    color="text.primary"
                  >
                    Location
                  </Typography>
                  <Typography variant="body1" color="text.primary">
                    {valueLocation}
                  </Typography>
                </>
              )}
              {/* While editing show the save and cancel buttons */}
              {editing && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "rows",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton
                    onClick={() => setEditing(!editing)}
                    color="error"
                    aria-label=""
                  >
                    <CancelIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => editInfo(plantName, valueLocation)}
                    color="success"
                    aria-label=""
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Box>
              )}
              <Typography fontWeight={700} variant="body1" color="text.primary">
                Watered
              </Typography>
              <Typography gutterBottom variant="body1" color="text.primary">
                {plant.watered}
              </Typography>
              {/* If noteList contains entries display the title */}
              {noteList.length > 0 && (
                <Typography
                  fontWeight={700}
                  gutterBottom
                  variant="body1"
                  color="text.primary"
                  sx={{ textDecoration: "underline" }}
                >
                  Notes
                </Typography>
              )}
              {noteList.length > 0 &&
                //Display the user added notes
                noteList.map((note, index) => {
                  const key = Math.random();
                  return (
                    <Note
                      key={key}
                      title={note.noteTitle}
                      body={note.noteBody}
                      idx={index}
                      plantId={plant._id}
                      username={user.username}
                      deleteNoteConfirmation={deleteNoteConfirmation}
                      saveNote={saveNote}
                    />
                  );
                })}
            </CardContent>

            <CardActions sx={{ justifyContent: "space-between" }}>
              <Button onClick={handleOpen} size="small" color="primary">
                Add notes
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
      <Footer />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="confirm-deletion"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {plantName}
          </Typography>
          <Button
            sx={{ position: "absolute", top: 0, right: 0 }}
            onClick={handleClose}
          >
            X
          </Button>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Add a note
          </Typography>

          <TextField
            id="outlined-textarea"
            label="Title (optional)"
            placeholder="E.g. Watering Frequency"
            multiline
            onChange={(newValue) => {
              setTitleValue(newValue.target.value);
            }}
          />
          <TextField
            id="outlined-multiline-static"
            label="Notes"
            placeholder="E.g. Once a week."
            multiline
            rows={4}
            onChange={(newValue) => {
              setNoteBodyValue(newValue.target.value);
            }}
          />
          <Button onClick={() => saveNote(titleValue, noteBodyValue)}>
            Save
          </Button>
        </Box>
      </Modal>

      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
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
            <UploadImage />
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {plantName}
            </Typography>

            <Button onClick={() => editImage(PATH)}>
              <Typography color="green">Save</Typography>
            </Button>
            <Button onClick={() => handleCloseEdit(false)}>
              <Typography color="red">Cancel</Typography>
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default PlantPage;
