export const addGardenPhoto = photo => ({
  type: "ADD_GARDENPHOTO",
  photo: photo
});
export const selectGardenPhoto = photo => ({
  type: "SELECT_GARDENPHOTO",
  photo: photo
});
export const photoClosed = () => ({
  type: "PHOTO_CLOSED"
});
