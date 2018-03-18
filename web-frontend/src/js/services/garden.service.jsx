import { addGardenPhoto } from "../actions/index";
import mockData from "../../mock/garden.json";
import uuidv1 from "uuid";
import store from "../store/index";


const GardenService = () => {
  mockData.photos.forEach(photo => {

    const id = uuidv1();
    store.dispatch(addGardenPhoto({ photo, id }));
  });
};

export default GardenService;
