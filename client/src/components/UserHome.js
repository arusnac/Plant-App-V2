import * as React from "react";
import { Box, Button, Typography, styled, Paper } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Nav from "./Nav";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { BASE_URL } from "../constants";
import PlantCard from "./PlantCard";
import { AccountContext } from "./Account";

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

  useEffect(() => {
    let userName = "";
    if (user) {
      userName = user.username;
      //dispatch(setUsername(userName));
      //setCurrentUser(userName);
      Axios.get(BASE_URL + "/user", {
        params: { username: userName },
      }).then((response) => {
        setPlantList(response.data.plants);
        //console.log(response.data.plants);
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
      if (plant["watered"] < today[0]) {
        tempArr.push(plant);
        console.log(plant["watered"]);
      }
    }
    //const today = new Date();
    console.log(today);
    setSpacesArr([...tempSet]);
    setPlantsToWater([...tempArr]);
    console.log(plantsToWater);
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
          <Box
            sx={{
              width: "50%",
            }}
          >
            <Grid xs={12}>
              <Typography variant="h4">Welcome {username}</Typography>
            </Grid>
            <Grid xs={12}>
              <Typography variant="h5">Your spaces</Typography>
            </Grid>
            <Grid xs={12}>
              <ScrollMenu
                style={{ overflowX: "hidden" }}
                LeftArrow={LeftArrow}
                RightArrow={RightArrow}
              >
                {spacesArr.map((space, index) => (
                  <Card
                    itemId={index} // NOTE: itemId is required for track items
                    title={space}
                    key={index}
                  >
                    {space}
                  </Card>
                ))}
              </ScrollMenu>
            </Grid>
            <Grid xs={8} sx={{ marginTop: 5 }}>
              <Typography variant="h5">Articles</Typography>
              <Typography variant="h6">Title</Typography>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Typography>
            </Grid>
          </Box>
          <Grid sx={{ padding: 0, marginLeft: 2 }} xs={3}>
            <Box sx={{}}>
              <Typography mt variant="h5">
                These plants might need water
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
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
            </Box>
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

function Card({ onClick, selected, title, itemId }) {
  const visibility = React.useContext(VisibilityContext);

  return (
    <div
      onClick={() => onClick(visibility)}
      style={{
        width: "260px",
        margin: 10,
        backgroundImage: `url("https://source.unsplash.com/random/200×200/?${title}")`,
        backgroundSize: "cover",
      }}
      tabIndex={0}
    >
      <div>
        <Typography
          variant="h6"
          sx={{
            background: "rgba(0, 0, 0, 0.1)",
            color: "white",
          }}
        >
          {title}
        </Typography>
        {/* <div>visible: {JSON.stringify(!!visibility.isItemVisible(itemId))}</div>
        <div>selected: {JSON.stringify(!!selected)}</div> */}
      </div>
      <div
        style={{
          height: "260px",
        }}
      />
    </div>
  );
}

export default UserHome;
