import * as React from "react";
import {
  Box,
  Button,
  Typography,
  styled,
  Paper,
  getImageListItemBarUtilityClass,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Nav from "./Nav";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { BASE_URL } from "../constants";
import PlantCard from "./PlantCard";
import { AccountContext } from "./Account";
import "../util/hideScrollbar.css";
import kitchen from "../assets/img/Kitchen.jpg";
import bedroom from "../assets/img/Bedroom.jpg";
import office from "../assets/img/Office.jpg";
import livingRoom from "../assets/img/LivingRoom.jpg";
import room from "../assets/img/Room.jpg";
import entryWay from "../assets/img/Entryway.jpg";
import { useNavigate } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const UserHome = () => {
  const [plantList, setPlantList] = useState([]);
  const [spacesArr, setSpacesArr] = useState([]);
  const [plantsToWater, setPlantsToWater] = useState([]);
  const { getUser } = useContext(AccountContext);
  const user = getUser();
  const username = user.username;
  const navigate = useNavigate();

  useEffect(() => {
    let userName = "";
    if (user) {
      userName = user.username;
      Axios.get(BASE_URL + "/user", {
        params: { username: userName },
      }).then((response) => {
        setPlantList(response.data.plants);
        getSpaces(response.data.plants);
      });
    } else {
      userName = "";
      console.log("error");
    }
  }, []);

  const getSpaces = (data) => {
    const tempSet = new Set();
    const tempArr = new Array();
    const today = new Date().toLocaleDateString("en-US");
    for (const plant of data) {
      if (plant["location"]) tempSet.add(plant["location"]);
      else continue;
      if (
        Number(plant["watered"][0] + plant["watered"][1]) < Number(today[0])
      ) {
        tempArr.push(plant);
        console.log(plant["watered"][0] + plant["watered"][1]);
      }
    }
    console.log(tempSet);
    setSpacesArr([...tempSet]);
    setPlantsToWater([...tempArr]);
    console.log(plantsToWater);
  };

  const getImage = (space) => {
    switch (space) {
      case "Kitchen":
        return kitchen;

      case "Bedroom":
        return bedroom;

      case "Living Room":
        return livingRoom;

      case "Office":
        return office;

      case "Entryway":
        return entryWay;

      default:
        return room;
    }
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Nav />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: 5,
          mt: 2,

          mb: 2,
        }}
      >
        <Grid sx={{ justifyContent: "center" }} container spacing={2}>
          <Grid xs={12}>
            <Box sx={{ backgroundColor: "#fff" }}>
              <Grid xs={12}>
                <Typography variant="h4">Welcome {username}</Typography>
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  borderBottom: "solid 1px",
                  justifyContent: "space-between",
                }}
                xs={12}
              >
                <Typography variant="h5">Your spaces</Typography>
                {/* <Button>Add a New Space</Button> */}
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {/* <ScrollMenu
                style={{ overflowY: "hidden" }}
                LeftArrow={LeftArrow}
                RightArrow={RightArrow}
              > */}
                {spacesArr.map((space, index) => (
                  <Card
                    itemId={index} // NOTE: itemId is required for track items
                    title={space}
                    image={getImage(space)}
                    key={index}
                  >
                    {space}
                  </Card>
                ))}
                {/* </ScrollMenu> */}
              </Grid>
              <Button onClick={() => navigate(`/plants`)}>
                View All Plants
              </Button>
            </Box>
            <Grid>
              <Typography mt variant="h5">
                These plants might need water
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 1,
                  marginTop: 3,
                }}
              >
                {plantsToWater.map((plants) => {
                  return (
                    <PlantCard
                      size={[150, 150, 100]}
                      // open={confirmationWindow}
                      // deletePlantCard={deletePlantCard}
                      key={plants._id}
                      id={plants._id}
                      name={plants.name}
                      image={plants.image}
                      // location={plants.location}
                      watered={plants.watered}
                      userName={user.username}
                    />
                  );
                })}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);

  return (
    <div
      style={{
        fontWeight: "700",
        fontSize: "30px",
        marginRight: 20,
      }}
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
    >
      {"<"}
    </div>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

  return (
    <div
      style={{
        fontWeight: "700",
        fontSize: "30px",
        marginLeft: 20,
      }}
      disabled={isLastItemVisible}
      onClick={() => scrollNext()}
    >
      {">"}
    </div>
  );
}

function Card({ onClick, selected, title, itemId, image }) {
  const visibility = React.useContext(VisibilityContext);

  const navigate = useNavigate();

  const navigateToSpace = (event) => {
    navigate(`plants/${event.target.textContent}`);
  };

  return (
    <div
      onClick={(e) => navigateToSpace(e)}
      style={{
        cursor: "pointer",
        width: "220px",
        margin: 10,
        textAlign: "center",
        backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url(${image})`,
        backgroundSize: "cover",
        borderRadius: "25% 10%",
        boxShadow: "1px 1px 5px black",
      }}
      tabIndex={0}
    >
      <div></div>
      <div
        style={{
          display: "flex",
          height: "220px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "white",
          }}
        >
          {title}
        </Typography>
      </div>
    </div>
  );
}

export default UserHome;
