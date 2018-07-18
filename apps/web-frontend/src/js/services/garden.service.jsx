import { addGardenPhoto } from "../actions/index";
import uuidv1 from "uuid";
import store from "../store/index";
import axios from "axios";

export const gatewayBaseUrl = "http://localhost:3000";

const GardenService = () => {
  axios
    .get("/user", {
      baseURL: gatewayBaseUrl,
      withCredentials: true
    })
    .catch(err => {
      if (err.response.status === 401) {
        location.href = `${gatewayBaseUrl}/login`;
      }
    })
    .then(response => response.data)
    .then(user => {
      axios
        .get("/user/me/photos", {
          baseURL: gatewayBaseUrl,
          withCredentials: true
        })
        .then(response => response.data)
        .then(jsonResponse => {
          jsonResponse.forEach(photo => {
            let gardenPhoto = {
              photo: {
                id: photo.id,
                source: photo.url,
                thumbnail: photo.url_thumbnail,
                edit: {
                  contrast: 100,
                  brightness: 100,
                  saturate: 100,
                  sepia: 0,
                  grayscale: 0,
                  invert: 0,
                  hueRotate: 0,
                  blur: 0
                }
              },
              id: photo.id
            };
            if (photo.r) {
              gardenPhoto = Object.assign({}, gardenPhoto, {
                color: {
                  r: photo.r,
                  g: photo.g,
                  b: photo.b
                }
              });
            }
            store.dispatch(addGardenPhoto(gardenPhoto));
          });
        });
    });
};

export default GardenService;
