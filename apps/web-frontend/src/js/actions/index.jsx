export const addGardenPhoto = photo => ({
  type: "ADD_GARDENPHOTO",
  photo: photo
});
export const selectGardenPhoto = photo => ({
  type: "SELECT_GARDENPHOTO",
  photo: photo
});
export const updateGardenPhoto = (photo) => ({
  type: "UPDATE_GARDENPHOTO",
  photo: photo
});
export const photoClosed = () => ({
  type: "PHOTO_CLOSED"
});
export const showEditor = show => ({
  type: "EDITOR_SHOW",
  show: show
});
export const editorMode = mode => ({
  type: "EDITOR_MODE",
  mode: mode
});
export const reverseGarden = () => ({
  type: "GARDEN_REVERSE"
});
export const sortByColor = () => ({
  type: "GARDEN_COLORSORT"
});
