import { addGardenPhoto } from "../actions/index";
import mockData from "../../mock/garden.json";
import uuidv1 from "uuid";
import store from "../store/index";


const GardenService = () => {
  fetch('http://localhost:3000/user',
    {
      method: 'GET',
      credentials: 'include'
    }
  ).catch(err => {
    // if 401 redirect to login
    console.log('err', err);
  }).then(response => {
    console.log('Response', response);
    if (response.status < 400) { return response.json(); } else {
      location.href = 'http://localhost:3000/login';
    }
  }).then(user => {
    console.log('user', user);
    fetch(`http://localhost:3002/photos?user_id=${user.user}`).then(response => {
      return response.json();
    }).then(jsonResponse => {
      jsonResponse.forEach(photo => {
        store.dispatch(addGardenPhoto({
          photo: {
            'source': photo.url,
            'thumbnail': photo.url_thumbnail,
            'full': photo.url
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
