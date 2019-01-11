import { sort as colorSort } from "color-sort";

function compareByKey(key) {
  return (obj1, obj2) => {
    let obj1value = obj1.photo[key];
    let obj2value = obj2.photo[key];
    if (obj1value < obj2value) {
      return -1;
    } else if (obj1value > obj2value) {
      return 1;
    } else {
      return 0;
    }
  };
}

function combineComparersOfSorters(photos, sorters) {
  for (let sorter of sorters) {
    photos = sorter.comparePhotos(photos);
  }
  return photos;
}

const IdSorter = {
  label: "ID",
  comparePhotos: photos => photos.sort(compareByKey("id"))
};
const colorSorter = {
  label: "Color",
  comparePhotos: photos => {
    const colorSorted = colorSort(photos);
    return colorSorted;
  }
};
const calendar = {
  label: "Date",
  comparePhotos: photos => {
    const photosWithShootDate = photos.filter(
      p => p.photo.shootDate !== undefined
    );
    photosWithShootDate.sort((a, b) => {
      return b.photo.shootDate - a.photo.shootDate;
    });
    const photosWithoutShootDate = photos.filter(
      p => p.photo.shootDate === undefined
    );
    const sortedPhotos = photosWithShootDate.concat(photosWithoutShootDate);
    return sortedPhotos;
  }
};
const edited = {
  label: "Edited",
  comparePhotos: photos => {
    const editedPhotos = photos.filter(
      p =>
        p.photo.edit.contrast !== 100 ||
        p.photo.edit.brightness !== 100 ||
        p.photo.edit.saturate !== 100 ||
        p.photo.edit.sepia !== 0 ||
        p.photo.edit.grayscale !== 0 ||
        p.photo.edit.invert !== 0 ||
        p.photo.edit.hueRotate !== 0 ||
        p.photo.edit.blur !== 0
    );
    return editedPhotos;
  }
};
const NoopSorter = {
  label: "None",
  comparePhotos: photos => photos
};
// TODO: rename sorters to better naming,
// remeber that names might also be used for retriving icons
export const sorters = {
  id: IdSorter,
  calendar: calendar,
  color: colorSorter,
  edit: edited
};

export const sortDirection = {
  ASCENDING: "ASCENDING",
  DESCENDING: "DESCENDING"
};

export function sortPhotosIfAny(sortSettings, photos) {
  // Never mutate external objects in-place
  let photosClone = [...photos];
  photosClone = combineComparersOfSorters(
    photosClone,
    sortSettings.methods.map(sorter => sorters[sorter])
  );
  return sortSettings.direction === sortDirection.DESCENDING
    ? photosClone.reverse()
    : photosClone;
}
