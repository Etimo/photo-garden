import { addGardenPhoto } from "../actions/index";
import mockData from "../../mock/garden.json";
import uuidv1 from "uuid";
import store from "../store/index";


const GardenService = () => {
  fetch('http://localhost:3000/user').catch(err => {
    // if 401 redirect to login
    console.log(err);
  }).then(response => {
    console.log(response);
    return response.json();
  }).then(user => {
    console.log(user);
    fetch(`http://localhost:3002/photos?user_id=${user.user}`).then(response => {
      return response.json();
    }).then(jsonResponse => {
      console.log(jsonResponse.length);
      jsonResponse.forEach(photo => {
        store.dispatch(addGardenPhoto({
          photo: {
            'source': photo.url,
            'thumbnail': photo.url
          }, id: photo.id
        }));
      });
    });
  });



  // mockData.photos.forEach(photo => {
  //   const id = uuidv1();
  //   store.dispatch(addGardenPhoto({ photo, id }));
  // });
};

export default GardenService;
