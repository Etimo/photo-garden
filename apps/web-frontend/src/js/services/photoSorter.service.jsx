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
  comparePhotos: photos => sortColors(photos)
};
const calendar = {
  label: "Date",
  comparePhotos: photos => {
    if (photos[0]) {
    }

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
    return photos.filter(p => p.id > 15);
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

export const sortOrder = {
  ASCENDING: "ASCENDING",
  DESCENDING: "DESCENDING"
};

export function sortPhotosIfAny(selectedSorters, photos, order) {
  // Never mutate external objects in-place
  let photosClone = [...photos];

  photosClone = combineComparersOfSorters(
    photosClone,
    selectedSorters.map(sorter => sorters[sorter])
  );

  return order === sortOrder.DESCENDING ? photosClone.reverse() : photosClone;
}
