import axios from "axios";

export const gatewayBaseUrl = process.env.PHOTO_GARDEN_GATEWAY_BASE_URL;

export class PhotoService {
  async saveEdits(photoId, edits) {
    await axios.post(`/user/me/photos/edit/${photoId}`, edits, {
      baseURL: gatewayBaseUrl,
      withCredentials: true
    });
  }
}
