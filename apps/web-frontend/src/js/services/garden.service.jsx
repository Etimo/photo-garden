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
  }).then(response => {
    if (response.status < 400) { return response.json(); } else {
      location.href = 'http://localhost:3000/login';
    }
  }).then(user => {
    fetch(`http://localhost:3002/photos?user_id=${user.user}`).then(response => {
      return response.json();
    }).then(jsonResponse => {
      jsonResponse.forEach(photo => {
        let gardenPhoto = {
          photo: {
            'id': photo.id,
            'source': photo.url,
            'thumbnail': photo.url,
            'edit': {
              'contrast': 100,
              'brightness': 100,
              'saturate': 100,
              'sepia': 0,
              'grayscale': 0,
              'invert': 0,
              'hueRotate': 0,
              'blur': 0
            }
          }, id: photo.id
        };
        if (photo.r) {
          gardenPhoto = Object.assign({}, gardenPhoto, {
            color: {
              r: photo.r,
              g: photo.g,
              b: photo.b
            }
          })
        }
        store.dispatch(addGardenPhoto(gardenPhoto));
      });
    });
  });



  // mockData.photos.forEach(photo => {
  //   const id = uuidv1();
  //   store.dispatch(addGardenPhoto({ photo, id }));
  // });
};

export default GardenService;
