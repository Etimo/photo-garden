import { addGardenPhoto } from "../actions/index";
import uuidv1 from "uuid";
import store from "../store/index";
import axios from "axios";

export const gatewayBaseUrl = process.env.PHOTO_GARDEN_GATEWAY_BASE_URL;

const GardenService = async () => {
  let user;
  try {
    user = (await axios.get("/user", {
      baseURL: gatewayBaseUrl,
      withCredentials: true
    })).data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      location.href = `${gatewayBaseUrl}/login`;
    } else {
      throw err;
    }
  }
  const photos = (await axios.get("/user/me/photos", {
    baseURL: gatewayBaseUrl,
    withCredentials: true
  })).data;
  for (const photo of photos) {
    let gardenPhoto = {
      photo: {
        id: photo.id,
        source: photo.webViewLink,
        thumbnail: photo.thumbnailLink,
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
  }
};

export default GardenService;
