import {
  Typography,
  CardActions,
  CardHeader,
  Box,
  Card,
  CardContent,
  CardMedia,
  Modal,
  CardActionArea,
  Stack,
} from "@mui/material";
import OpacityIcon from "@mui/icons-material/Opacity";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import Axios from "axios";
import plantInfo from "../assets/plantInfo.json";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import UploadImage from "../components/UploadImage";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../constants";
import { BASE_URL } from "../constants";
import { setImagePath } from "../redux/UserSlice";

const filter = createFilterOptions();
const PlantCard = ({
  userName,
  name,
  image,
  location,
  watered,
  id,
  deletePlantCard,
}) => {
  //Toggles the edit options for name and location
  const [editing, setEditing] = useState(false);

  //Hold plant info and reRender on edits
  const [plantName, setPlantName] = useState("");
  const [currentId, setCurrentId] = useState("");
  const [waterDate, setWaterDate] = useState(watered);
  const [imagePath, setImagePath] = useState(image);
  const [valueLocation, setValueLocation] = useState(null);

  //Toggles the light info modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  const [imageButton, showImageButton] = useState(false);
  const PATH = useSelector((state) => state.user.value.imagePath);

  //handles the the upload image modal
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  let navigate = useNavigate();
  const dispatch = useDispatch();

  //Set the name and image path from the props
  useEffect(() => {
    setPlantName(name);
    setImagePath(image);
    setValueLocation(location);
    setCurrentId(id);
  }, []);

  //Update the watering date to today
  const updateWatered = (plantId) => {
    const watered = new Date().toLocaleDateString();
    const id = plantId;
    Axios.post(
      BASE_URL + "/user/water",
      { id: id, watered: watered },
      {
        params: {
          username: userName,
          id: plantId,
        },
      }
    ).then((response) => {
      setWaterDate(watered);
    });
  };

  //Edit the plants name
  const editInfo = (plantId, name, location) => {
    const id = plantId;
    Axios.post(
      BASE_URL + "/user/edit",
      { id: id, name: name, location: location },
      {
        params: {
          username: userName,
          id: plantId,
        },
      }
    ).then((response) => {
      setPlantName(name);
      setValueLocation(location);
      handleCloseEdit(false);
      setEditing(false);
    });
  };

  // //Upload a new image for the plant
  // const editImage = (plantId, PATH) => {
  //   const id = plantId;
  //   Axios.post(
  //     BASE_URL + "/user/editImage",
  //     { id: id, imagePath: PATH },
  //     {
  //       params: {
  //         username: userName,
  //         id: plantId,
  //       },
  //     }
  //   ).then((response) => {
  //     setImagePath(PATH);
  //     //dispatch(setImagePath(""));
  //     setOpenEdit(false);
  //   });
  // };

  const deletePlant = () => {
    Axios.post(
      BASE_URL + "/user/delete",
      { id: id },
      {
        params: {
          username: userName,
        },
      }
    ).then((response) => {
      handleClose();
    });
  };

  //Toggle light modal
  const [light, setLight] = useState("");

  //If the plants light info exists, show in a modal
  const lightInfo = (name) => {
    const plantName = name.toUpperCase();
    setPlantName(plantName);
    if (plantName in plantInfo) {
      setLight(plantInfo[plantName].LIGHT);
    } else {
      setLight("No light information found");
    }
    handleOpen();
  };

  //style for modal
  const style = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
    <div>
      <Card
        onMouseOut={() => showImageButton(false)}
        onMouseOver={() => showImageButton(true)}
        variant="outlined"
        sx={{
          minWidth: 275,
          maxWidth: 275,
          "&:hover": {},
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: 4,
        }}
      >
        <CardActionArea
          onClick={() => {
            navigate(`/plantpage/${id}`, { userName: userName, id: id });
          }}
        >
          <CardHeader
            sx={{ backgroundColor: "#fff" }}
            titleTypographyProps={{ fontWeight: 300 }}
            title={plantName}
          />

          <CardMedia
            onClick={() => navigate(`/plantpage/${id}`)}
            component="img"
            alt="user plant"
            height="280"
            sx={{ marginRight: 5, width: "inherit", boxShadow: 2 }}
            image={
              imagePath
                ? imagePath
                : "https://dummyimage.com/345x345/696969/696969"
            }
          />

          <CardContent>
            <Typography>
              Location: {valueLocation}
              <br />
            </Typography>
            <Typography>Last watered: {waterDate}</Typography>
            {/* <IconButton variant="contained" color="primary"><OpacityIcon /></IconButton> */}
          </CardContent>
        </CardActionArea>
        {/* <Button size="small" variant="contained" color="primary" value={plants.name} onClick={lightInfo}>?</Button> */}
        <CardActions>
          <IconButton
            onClick={() => updateWatered(id)}
            color="primary"
            aria-label="update watering"
          >
            <OpacityIcon />
          </IconButton>
          {imageButton && (
            <>
              {/* <IconButton
                onClick={handleOpenEdit}
                color="success"
                aria-label="uplaod new image"
              >
                <AddPhotoAlternateIcon />
              </IconButton> */}

              <IconButton
                value={plantName}
                onClick={() => lightInfo(plantName)}
                sx={{ color: "palette.error.main" }}
                color="error"
              >
                <DeleteIcon color="white" />
              </IconButton>
            </>
          )}
        </CardActions>
      </Card>
      {/* 
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
            
            <Button onClick={() => editImage(id, PATH)}>
              <Typography color="green">Save</Typography>
            </Button>
            <Button onClick={() => handleCloseEdit(false)}>
              <Typography color="red">Cancel</Typography>
            </Button> 
          </Stack>
        </Box>
      </Modal> */}

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
          <Typography id="modal-modal-description" sx={{ mt: 2, mb: 4 }}>
            Are you sure you want to delete this plant?
          </Typography>

          <Button onClick={deletePlantCard} value={id}>
            Confirm
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default PlantCard;
