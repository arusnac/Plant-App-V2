import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AccountContext } from "../components/Account";
import Axios from "axios";
import { BASE_URL } from "../constants";
import PlantCard from "../components/PlantCard";

const PlantBySpace = () => {
  const [plantList, setPlantList] = useState([]);
  let params = useParams();
  const { getUser } = useContext(AccountContext);
  const user = getUser();

  useEffect(() => {
    if (user) {
      //userName = user.username;
      //dispatch(setUsername(userName));
      //setCurrentUser(userName);
      Axios.get(BASE_URL + "/user", {
        params: {
          username: user.username,
          option: true,
          attribute: params.space,
        },
      }).then((response) => {
        console.log(response.data);
        setPlantList(response.data);
      });
    } else {
      //user.username = "";
      console.log("Can't get plants");
    }
  }, []);

  return (
    <>
      {plantList.map((plant) => {
        return (
          <PlantCard
            size={[275, 275, 280]}
            key={plant._id}
            id={plant._id}
            name={plant.name}
            image={plant.image}
            location={plant.location}
            watered={plant.watered}
            userName={user.username}
          />
        );
      })}
    </>
  );
};

export default PlantBySpace;
