const GeoWebCoordinate = require("../");
const test = require("assert");
const BN = require("bn.js");

exports.testFromGPSBasic = function (test) {
  let lon = 110.0;
  let lat = 38.0;

  let gwCoord = GeoWebCoordinate.from_gps(lon, lat);

  test.equal(
    gwCoord.toString(),
    GeoWebCoordinate.make_gw_coord("13514979", "5965232").toString()
  );
  test.done();
};

exports.testFromGPSOrigin = function (test) {
  let lon = -180.0;
  let lat = -90.0;

  let gwCoord = GeoWebCoordinate.from_gps(lon, lat);

  test.equal(
    gwCoord.toString(),
    GeoWebCoordinate.make_gw_coord("0", "0").toString()
  );
  test.done();
};

exports.testFromGPSMeridianEquator = function (test) {
  let lon = 0.0;
  let lat = 0.0;

  let gwCoord = GeoWebCoordinate.from_gps(lon, lat);

  test.equal(
    gwCoord.toString(),
    GeoWebCoordinate.make_gw_coord("8388608", "4194304").toString()
  );
  test.done();
};

exports.testFromGPSMeridian = function (test) {
  let lon = 179.9999785425;
  let lat = 0.0;

  let gwCoord = GeoWebCoordinate.from_gps(lon, lat);

  test.equal(
    gwCoord.toString(),
    GeoWebCoordinate.make_gw_coord("16777215", "4194304").toString()
  );
  test.done();
};

exports.testFromGPSNorthPole = function (test) {
  let lon = 0.0;
  let lat = 89.9999785425;

  let gwCoord = GeoWebCoordinate.from_gps(lon, lat);

  test.equal(
    gwCoord.toString(),
    GeoWebCoordinate.make_gw_coord("8388608", "8388607").toString()
  );
  test.done();
};

exports.testFromGPSLonOutOfBounds1 = function (test) {
  let lon = 181.0;
  let lat = 0.0;

  test.throws(() => GeoWebCoordinate.from_gps(lon, lat));
  test.done();
};

exports.testFromGPSLonOutOfBounds2 = function (test) {
  let lon = -181.0;
  let lat = 0.0;

  test.throws(() => GeoWebCoordinate.from_gps(lon, lat));
  test.done();
};

exports.testFromGPSLonOutOfBounds3 = function (test) {
  let lon = 180.0;
  let lat = 0.0;

  test.throws(() => GeoWebCoordinate.from_gps(lon, lat));
  test.done();
};

exports.testFromGPSLatOutOfBounds1 = function (test) {
  let lon = 0.0;
  let lat = 91.0;

  test.throws(() => GeoWebCoordinate.from_gps(lon, lat));
  test.done();
};

exports.testFromGPSLatOutOfBounds2 = function (test) {
  let lon = 0.0;
  let lat = -91.0;

  test.throws(() => GeoWebCoordinate.from_gps(lon, lat));
  test.done();
};

exports.testFromGPSLatOutOfBounds3 = function (test) {
  let lon = 0.0;
  let lat = 90.0;

  test.throws(() => GeoWebCoordinate.from_gps(lon, lat));
  test.done();
};

exports.testToGPSBasic = function (test) {
  let gwCoord = GeoWebCoordinate.make_gw_coord("13514979", "5965232");

  let gpsCoords = GeoWebCoordinate.to_gps(gwCoord);

  let bl = gpsCoords[0];
  let br = gpsCoords[1];
  let tr = gpsCoords[2];
  let tl = gpsCoords[3];

  test.equal(bl[0].toFixed(10), "109.9999880790");
  test.equal(bl[1].toFixed(10), "37.9999923706");
  test.equal(br[0].toFixed(10), "110.0000095367");
  test.equal(br[1].toFixed(10), "37.9999923706");
  test.equal(tr[0].toFixed(10), "110.0000095367");
  test.equal(tr[1].toFixed(10), "38.0000138282");
  test.equal(tl[0].toFixed(10), "109.9999880790");
  test.equal(tl[1].toFixed(10), "38.0000138282");
  test.done();
};

exports.testToGPSOrigin = function (test) {
  let gwCoord = GeoWebCoordinate.make_gw_coord("0", "0");

  let gpsCoords = GeoWebCoordinate.to_gps(gwCoord);

  let bl = gpsCoords[0];
  let br = gpsCoords[1];
  let tr = gpsCoords[2];
  let tl = gpsCoords[3];

  test.equal(bl[0].toFixed(10), "-180.0000000000");
  test.equal(bl[1].toFixed(10), "-90.0000000000");
  test.equal(br[0].toFixed(10), "-179.9999785423");
  test.equal(br[1].toFixed(10), "-90.0000000000");
  test.equal(tr[0].toFixed(10), "-179.9999785423");
  test.equal(tr[1].toFixed(10), "-89.9999785423");
  test.equal(tl[0].toFixed(10), "-180.0000000000");
  test.equal(tl[1].toFixed(10), "-89.9999785423");
  test.done();
};

exports.testToGPSMeridianEquator = function (test) {
  let gwCoord = GeoWebCoordinate.make_gw_coord("8388608", "4194304");

  let gpsCoords = GeoWebCoordinate.to_gps(gwCoord);

  let bl = gpsCoords[0];
  let br = gpsCoords[1];
  let tr = gpsCoords[2];
  let tl = gpsCoords[3];

  test.equal(bl[0].toFixed(10), "0.0000000000");
  test.equal(bl[1].toFixed(10), "0.0000000000");
  test.equal(br[0].toFixed(10), "0.0000214576");
  test.equal(br[1].toFixed(10), "0.0000000000");
  test.equal(tr[0].toFixed(10), "0.0000214576");
  test.equal(tr[1].toFixed(10), "0.0000214576");
  test.equal(tl[0].toFixed(10), "0.0000000000");
  test.equal(tl[1].toFixed(10), "0.0000214576");
  test.done();
};

exports.testToGPSMeridian = function (test) {
  let gwCoord = GeoWebCoordinate.make_gw_coord("16777215", "4194304");

  let gpsCoords = GeoWebCoordinate.to_gps(gwCoord);

  let bl = gpsCoords[0];
  let br = gpsCoords[1];
  let tr = gpsCoords[2];
  let tl = gpsCoords[3];

  test.equal(bl[0].toFixed(10), "179.9999785423");
  test.equal(bl[1].toFixed(10), "0.0000000000");
  test.equal(br[0].toFixed(10), "180.0000000000");
  test.equal(br[1].toFixed(10), "0.0000000000");
  test.equal(tr[0].toFixed(10), "180.0000000000");
  test.equal(tr[1].toFixed(10), "0.0000214576");
  test.equal(tl[0].toFixed(10), "179.9999785423");
  test.equal(tl[1].toFixed(10), "0.0000214576");
  test.done();
};

exports.testToGPSNorthPole = function (test) {
  let gwCoord = GeoWebCoordinate.make_gw_coord("8388608", "8388607");

  let gpsCoords = GeoWebCoordinate.to_gps(gwCoord);

  let bl = gpsCoords[0];
  let br = gpsCoords[1];
  let tr = gpsCoords[2];
  let tl = gpsCoords[3];

  test.equal(bl[0].toFixed(10), "0.0000000000");
  test.equal(bl[1].toFixed(10), "89.9999785423");
  test.equal(br[0].toFixed(10), "0.0000214576");
  test.equal(br[1].toFixed(10), "89.9999785423");
  test.equal(tr[0].toFixed(10), "0.0000214576");
  test.equal(tr[1].toFixed(10), "90.0000000000");
  test.equal(tl[0].toFixed(10), "0.0000000000");
  test.equal(tl[1].toFixed(10), "90.0000000000");
  test.done();
};

exports.testToGPSLonOutOfBounds = function (test) {
  let gwCoord = GeoWebCoordinate.make_gw_coord("16777216", "4194304");

  test.throws(() => GeoWebCoordinate.to_gps(gwCoord));

  test.done();
};

exports.testToGPSLatOutOfBounds = function (test) {
  let gwCoord = GeoWebCoordinate.make_gw_coord("16777215", "8388608");

  test.throws(() => GeoWebCoordinate.to_gps(gwCoord));

  test.done();
};

return exports;
