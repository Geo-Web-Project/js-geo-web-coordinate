const GeoWebCoordinate = require("../");
const test = require("assert");
const BN = require("bn.js");

function makePathPrefix(length) {
  return new BN(length).shln(256 - 8);
}

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

exports.testAppendPathEmpty = function (test) {
  let path = new BN(0);
  let direction = new BN("10", 2);

  let newPath = GeoWebCoordinate.append_to_path(path, direction);

  test.equal(
    newPath.toString(2),
    "100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010"
  );
  test.done();
};

exports.testAppendPathMultiple = function (test) {
  let newPath = GeoWebCoordinate.append_to_path(new BN(0), new BN("10", 2));
  newPath = GeoWebCoordinate.append_to_path(newPath, new BN("00", 2));
  newPath = GeoWebCoordinate.append_to_path(newPath, new BN("01", 2));
  newPath = GeoWebCoordinate.append_to_path(newPath, new BN("01", 2));
  newPath = GeoWebCoordinate.append_to_path(newPath, new BN("11", 2));

  test.equal(
    newPath.toString(2),
    "10100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001101010010"
  );
  test.done();
};

exports.testAppendPathTooLong = function (test) {
  test.throws(() =>
    GeoWebCoordinate.append_to_path(new BN(125).shln(248), new BN("10", 2))
  );
  test.done();
};

exports.testMakeRectPathSingle = function (test) {
  let sourceCoord = GeoWebCoordinate.make_gw_coord("0", "0");
  let destCoord = GeoWebCoordinate.make_gw_coord("0", "0");

  let paths = GeoWebCoordinate.make_rect_path(sourceCoord, destCoord);
  test.equal(paths.length, 0);
  test.done();
};

exports.testMakeRectPathSquare1 = function (test) {
  let sourceCoord = GeoWebCoordinate.make_gw_coord("0", "0");
  let destCoord = GeoWebCoordinate.make_gw_coord("2", "2");

  let paths = GeoWebCoordinate.make_rect_path(sourceCoord, destCoord);
  let expectedPath = makePathPrefix(8).or(new BN("1010001111001010", 2));
  test.equal(paths.length, 1);
  test.equal(paths[0].toString(2), expectedPath.toString(2));
  test.done();
};

exports.testMakeRectPathSquare2 = function (test) {
  let sourceCoord = GeoWebCoordinate.make_gw_coord("2", "2");
  let destCoord = GeoWebCoordinate.make_gw_coord("0", "0");

  let paths = GeoWebCoordinate.make_rect_path(sourceCoord, destCoord);
  let expectedPath = makePathPrefix(8).or(new BN("1111011010011111", 2));
  test.equal(paths.length, 1);
  test.equal(paths[0].toString(2), expectedPath.toString(2));
  test.done();
};

exports.testMakeRectPathSquare3 = function (test) {
  let sourceCoord = GeoWebCoordinate.make_gw_coord("0", "2");
  let destCoord = GeoWebCoordinate.make_gw_coord("2", "0");

  let paths = GeoWebCoordinate.make_rect_path(sourceCoord, destCoord);
  let expectedPath = makePathPrefix(8).or(new BN("1010011111011010", 2));
  test.equal(paths.length, 1);
  test.equal(paths[0].toString(2), expectedPath.toString(2));
  test.done();
};

exports.testMakeRectPathSquare4 = function (test) {
  let sourceCoord = GeoWebCoordinate.make_gw_coord("2", "0");
  let destCoord = GeoWebCoordinate.make_gw_coord("0", "2");

  let paths = GeoWebCoordinate.make_rect_path(sourceCoord, destCoord);
  let expectedPath = makePathPrefix(8).or(new BN("1111001010001111", 2));
  test.equal(paths.length, 1);
  test.equal(paths[0].toString(2), expectedPath.toString(2));
  test.done();
};

exports.testMakeRectPathRect1 = function (test) {
  let sourceCoord = GeoWebCoordinate.make_gw_coord("0", "0");
  let destCoord = GeoWebCoordinate.make_gw_coord("2", "3");

  let paths = GeoWebCoordinate.make_rect_path(sourceCoord, destCoord);
  let expectedPath = makePathPrefix(11).or(new BN("1111001010001111001010", 2));
  test.equal(paths.length, 1);
  test.equal(paths[0].toString(2), expectedPath.toString(2));
  test.done();
};

exports.testMakeRectPathRect2 = function (test) {
  let sourceCoord = GeoWebCoordinate.make_gw_coord("0", "0");
  let destCoord = GeoWebCoordinate.make_gw_coord("3", "2");

  let paths = GeoWebCoordinate.make_rect_path(sourceCoord, destCoord);
  let expectedPath = makePathPrefix(11).or(new BN("1010100011111100101010", 2));
  test.equal(paths.length, 1);
  test.equal(paths[0].toString(2), expectedPath.toString(2));
  test.done();
};

exports.testMakeRectEastLine = function (test) {
  let sourceCoord = GeoWebCoordinate.make_gw_coord("0", "0");
  let destCoord = GeoWebCoordinate.make_gw_coord("2", "0");

  let paths = GeoWebCoordinate.make_rect_path(sourceCoord, destCoord);
  let expectedPath = makePathPrefix(2).or(new BN("1010", 2));
  test.equal(paths.length, 1);
  test.equal(paths[0].toString(2), expectedPath.toString(2));
  test.done();
};

exports.testMakeRectWestLine = function (test) {
  let sourceCoord = GeoWebCoordinate.make_gw_coord("2", "0");
  let destCoord = GeoWebCoordinate.make_gw_coord("0", "0");

  let paths = GeoWebCoordinate.make_rect_path(sourceCoord, destCoord);
  let expectedPath = makePathPrefix(2).or(new BN("1111", 2));
  test.equal(paths.length, 1);
  test.equal(paths[0].toString(2), expectedPath.toString(2));
  test.done();
};

exports.testMakeRectNorthLine = function (test) {
  let sourceCoord = GeoWebCoordinate.make_gw_coord("0", "0");
  let destCoord = GeoWebCoordinate.make_gw_coord("0", "2");

  let paths = GeoWebCoordinate.make_rect_path(sourceCoord, destCoord);
  let expectedPath = makePathPrefix(2).or(new BN("0000", 2));
  test.equal(paths.length, 1);
  test.equal(paths[0].toString(2), expectedPath.toString(2));
  test.done();
};

exports.testMakeRectSouthLine = function (test) {
  let sourceCoord = GeoWebCoordinate.make_gw_coord("0", "2");
  let destCoord = GeoWebCoordinate.make_gw_coord("0", "0");

  let paths = GeoWebCoordinate.make_rect_path(sourceCoord, destCoord);
  let expectedPath = makePathPrefix(2).or(new BN("0101", 2));
  test.equal(paths.length, 1);
  test.equal(paths[0].toString(2), expectedPath.toString(2));
  test.done();
};

exports.testMakeLongPath = function (test) {
  let sourceCoord = GeoWebCoordinate.make_gw_coord("0", "0");
  let destCoord = GeoWebCoordinate.make_gw_coord("0", "200");

  let paths = GeoWebCoordinate.make_rect_path(sourceCoord, destCoord);
  test.equal(paths.length, 2);
  test.equal(paths[0].toString(2), makePathPrefix(124).toString(2));
  test.equal(paths[1].toString(2), makePathPrefix(76).toString(2));
  test.done();
};

return exports;
