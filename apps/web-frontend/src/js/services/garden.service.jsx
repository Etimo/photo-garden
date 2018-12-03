import { addGardenPhoto } from "../actions/index";
import uuidv1 from "uuid";
import store from "../store/index";
import axios from "axios";

export const gatewayBaseUrl = process.env.PHOTO_GARDEN_GATEWAY_BASE_URL;

class GardenService {
  user;
  constructor() {
    this.getPhotos();
  }

  async getUser() {
    try {
      return (await axios.get("/user", {
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
  }
  async getPhotos() {
    this.user = await this.getUser();

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
          edit: photo.edit
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
  }
  async saveEdits(photoId, edits) {
    await axios.post("/user/me/photos/edit", edits, {
      baseURL: gatewayBaseUrl,
      withCredentials: true
    });
  }
}

export default GardenService;
