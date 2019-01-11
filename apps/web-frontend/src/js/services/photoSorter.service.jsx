import { CONN_CLOSED } from "nats";

function colorDistance(color1, color2) {
  var result = 0;
  for (var i = 0; i < color1.length; i++) {
    result += (color1[i] - color2[i]) * (color1[i] - color2[i]);
  }

  return result;
}

function sortColors(colors) {
  const distances = [];
  for (let i = 0; i < colors.length; i++) {
    distances[i] = [];
    for (let j = 0; j < i; j++) {
      distances.push([
        colors[i],
        colors[j],
        colorDistance(colors[i], colors[j])
      ]);
    }
  }
  distances.sort(function(a, b) {
    return a[2] - b[2];
  });

  let colorToCluster = {};
  for (let i = 0; i < colors.length; i++) {
    colorToCluster[colors[i]] = [colors[i]];
  }
  let lastCluster;
  for (let i = 0; i < distances.length; i++) {
    let color1 = distances[i][0];
    let color2 = distances[i][1];
    let cluster1 = colorToCluster[color1];
    let cluster2 = colorToCluster[color2];
    if (!cluster1 || !cluster2 || cluster1 == cluster2) {
      continue;
    }

    if (color1 != cluster1[cluster1.length - 1]) {
      cluster1.reverse();
    }

    if (color2 != cluster2[0]) {
      cluster2.reverse();
    }

    cluster1.push.apply(cluster1, cluster2);
    delete colorToCluster[color1];
    delete colorToCluster[color2];
    colorToCluster[cluster1[0]] = cluster1;
    colorToCluster[cluster1[cluster1.length - 1]] = cluster1;
    lastCluster = cluster1;
  }

  return lastCluster;
}

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
    let photos = sorter.comparePhotos(photos);
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
  label: "Calendar",
  comparePhotos: photos => photos.sort(compareByKey("shootDate"))
};
const edited = {
  label: "Edited",
  comparePhotos: photos => {
    console.log(photos);
    return photos.filter(p => p.id > 15);
  }
};
const NoopSorter = {
  label: "None",
  comparePhotos: photos => photos
};

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

export function sortPhotos(selectedSorters, photos, order) {
  // Never mutate external objects in-place

  console.log(photos);
  let photosClone = [...photos];

  photosClone = combineComparersOfSorters(
    photosClone,
    selectedSorters.map(sorter => sorters[sorter])
  );

  return order === sortOrder.DESCENDING ? photosClone.reverse() : photosClone;
}
