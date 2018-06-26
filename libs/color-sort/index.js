const sort = photos => {
  var distances = [];
  for (let i = 0; i < photos.length; i++) {
    for (let j = 0; j < i; j++) {
      distances.push([
        photos[i],
        photos[j],
        colorDistance(photos[i].color, photos[j].color)
      ]);
    }
  }

  distances.sort((a, b) => a[2] - b[2]);

  // Put each color into separate cluster initially
  let colorToCluster = {};
  for (let i = 0; i < photos.length; i++) {
    colorToCluster["c" + photos[i].id] = [photos[i]];
  }
  let lastCluster;
  for (let i = 0; i < distances.length; i++) {
    let photo1 = distances[i][0];
    let photo2 = distances[i][1];
    let distance = distances[i][2];
    let cluster1 = colorToCluster["c" + photo1.id];
    let cluster2 = colorToCluster["c" + photo2.id];

    if (!cluster1 || !cluster2 || cluster1 == cluster2) {
      continue;
    }

    // Make sure color1 is at the end of its cluster and
    // color2 at the beginning.
    if (photo1 != cluster1[cluster1.length - 1]) cluster1.reverse();
    if (photo2 != cluster2[0]) cluster2.reverse();
    // Merge cluster2 into cluster1
    cluster1.push.apply(cluster1, cluster2);
    delete colorToCluster["c" + photo1.id];
    delete colorToCluster["c" + photo2.id];
    colorToCluster["c" + cluster1[0].id] = cluster1;
    colorToCluster[cluster1[cluster1.length - 1]] = cluster1;
    lastCluster = cluster1;
  }
  // By now all colors should be in one cluster
  return lastCluster;
};
// https://en.wikipedia.org/wiki/Color_difference
const colorDistance = (color1, color2) =>
  Math.sqrt(
    2 * Math.pow(color2.r - color1.r, 2) +
      4 * Math.pow(color2.g - color1.g, 2) +
      3 * Math.pow(color2.b - color1.b, 2)
  );

module.exports = {
  sort
};
