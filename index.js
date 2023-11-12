const gdal = require('gdal');

/**
 * Returns the altitude with the provided latitude, longitude and DTM file route.
 *
 * @param {number}   latitude          Latitude point.
 * @param {number}   longitude         Longitude point.
 * @param {string}   dtmFileRoute      Route of the DTM file.
 *
 * @return {number | undefined} The altitude based on the latitude and longitude of the DTM file.
 */
function getAltitude(latitude, longitude, dtmFileRoute) {
  if (checkIfNumbers(latitude, longitude)) {
    try {
      // Open the dataset (DTM file)
      const dataset = gdal.open(dtmFileRoute);
      const band = dataset.bands.get(1);

      // Convert lat/lon to the pixel/line coordinates
      const transform = new gdal.CoordinateTransformation(
        gdal.SpatialReference.fromEPSG(4326),
        dataset
      );
      const point = transform.transformPoint(longitude, latitude);

      // Read the value from the band
      const altitude = band.pixels.get(
        Math.floor(point.x),
        Math.floor(point.y)
      );

      return altitude;
    } catch (error) {
      console.error(`Out of range error:\n` + error);
      return;
    }
  } else {
    console.error(`Latitude and longitude can only be numbers`);
    return;
  }
}

/**
 * Returns true if the latitude and longitude are numbers and false if they are not.
 *
 * @param {number}   latitude          Latitude point.
 * @param {number}   longitude         Longitude point.
 *
 * @return {boolean}
 */
const checkIfNumbers = (latitude, longitude) => {
  if (isNaN(latitude) || isNaN(longitude)) return false;

  return true;
};

module.exports = getAltitude;
