/* eslint-disable import/no-unresolved */
import {
  GeoWebCoordinate,
  DEFAULT_GW_MAX_LAT,
  DEFAULT_GW_MAX_LON,
} from "../src";
// eslint-disable-next-line import/named
import { BigNumber, BigNumberish } from "ethers";
import { BN } from "bn.js";

function makePathPrefix(length: number) {
  return BigNumber.from(length).shl(256 - 8);
}

function toBN(value: BigNumberish) {
  const hex = BigNumber.from(value).toHexString();
  if (hex[0] === "-") {
    return new BN("-" + hex.substring(3), 16);
  }
  return new BN(hex.substring(2), 16);
}

test("From GPS Basic", () => {
  const lon = 110.0;
  const lat = 38.0;

  const gwCoord = GeoWebCoordinate.fromGPS(lon, lat);

  expect(gwCoord.toString()).toEqual(
    GeoWebCoordinate.fromXandY(422343, 186413).toString()
  );
});

test("From GPS Origin", () => {
  const lon = -180.0;
  const lat = -90.0;

  const gwCoord = GeoWebCoordinate.fromGPS(lon, lat);

  expect(gwCoord.toString()).toEqual(
    GeoWebCoordinate.fromXandY(0, 0).toString()
  );
});

test("From GPS Meridian Equator", () => {
  const lon = 0.0;
  const lat = 0.0;

  const gwCoord = GeoWebCoordinate.fromGPS(lon, lat);

  expect(gwCoord.toString()).toEqual(
    GeoWebCoordinate.fromXandY(
      DEFAULT_GW_MAX_LON.div(2).add(1),
      DEFAULT_GW_MAX_LAT.div(2).add(1)
    ).toString()
  );
});

test("From GPS Meridian", () => {
  const lon = 179.9999785425;
  const lat = 0.0;

  const gwCoord = GeoWebCoordinate.fromGPS(lon, lat);

  expect(gwCoord.toString()).toEqual(
    GeoWebCoordinate.fromXandY(
      DEFAULT_GW_MAX_LON,
      DEFAULT_GW_MAX_LAT.div(2).add(1)
    ).toString()
  );
});

test("From GPS North Pole", () => {
  const lon = 0.0;
  const lat = 89.9999785425;

  const gwCoord = GeoWebCoordinate.fromGPS(lon, lat);

  expect(gwCoord.toString()).toEqual(
    GeoWebCoordinate.fromXandY(
      DEFAULT_GW_MAX_LON.div(2).add(1),
      DEFAULT_GW_MAX_LAT
    ).toString()
  );
});

test("From GPS Lon Out Of Bounds 1", () => {
  const lon = 181.0;
  const lat = 0.0;

  expect(() => GeoWebCoordinate.fromGPS(lon, lat)).toThrow();
});

test("From GPS Lon Out Of Bounds 2", () => {
  const lon = -181.0;
  const lat = 0.0;

  expect(() => GeoWebCoordinate.fromGPS(lon, lat)).toThrow();
});

test("From GPS Lon Out Of Bounds 3", () => {
  const lon = 180.0;
  const lat = 0.0;

  expect(() => GeoWebCoordinate.fromGPS(lon, lat)).toThrow();
});

test("From GPS Lat Out Of Bounds 1", () => {
  const lon = 0.0;
  const lat = 91.0;

  expect(() => GeoWebCoordinate.fromGPS(lon, lat)).toThrow();
});

test("From GPS Lat Out Of Bounds 2", () => {
  const lon = 0.0;
  const lat = -91.0;

  expect(() => GeoWebCoordinate.fromGPS(lon, lat)).toThrow();
});

test("From GPS Lat Out Of Bounds 3", () => {
  const lon = 0.0;
  const lat = 90.0;

  expect(() => GeoWebCoordinate.fromGPS(lon, lat)).toThrow();
});

test("To GPS Basic", () => {
  const gwCoord = GeoWebCoordinate.fromXandY("422343", "186413");

  const gpsCoords = gwCoord.toGPS();

  const bl = gpsCoords[0];
  const br = gpsCoords[1];
  const tr = gpsCoords[2];
  const tl = gpsCoords[3];

  expect(bl[0].toFixed(10)).toEqual("109.9999237060");
  expect(bl[1].toFixed(10)).toEqual("37.9996490478");
  expect(br[0].toFixed(10)).toEqual("110.0006103515");
  expect(br[1].toFixed(10)).toEqual("37.9996490478");
  expect(tr[0].toFixed(10)).toEqual("110.0006103515");
  expect(tr[1].toFixed(10)).toEqual("38.0003356933");
  expect(tl[0].toFixed(10)).toEqual("109.9999237060");
  expect(tl[1].toFixed(10)).toEqual("38.0003356933");
});

test("To GPS Origin", () => {
  const gwCoord = GeoWebCoordinate.fromXandY("0", "0");

  const gpsCoords = gwCoord.toGPS();

  const bl = gpsCoords[0];
  const br = gpsCoords[1];
  const tr = gpsCoords[2];
  const tl = gpsCoords[3];

  expect(bl[0].toFixed(10)).toEqual("-180.0000000000");
  expect(bl[1].toFixed(10)).toEqual("-90.0000000000");
  expect(br[0].toFixed(10)).toEqual("-179.9993133544");
  expect(br[1].toFixed(10)).toEqual("-90.0000000000");
  expect(tr[0].toFixed(10)).toEqual("-179.9993133544");
  expect(tr[1].toFixed(10)).toEqual("-89.9993133544");
  expect(tl[0].toFixed(10)).toEqual("-180.0000000000");
  expect(tl[1].toFixed(10)).toEqual("-89.9993133544");
});

test("To GPS Meridian Equator", () => {
  const gwCoord = GeoWebCoordinate.fromXandY(
    DEFAULT_GW_MAX_LON.div(2).add(1),
    DEFAULT_GW_MAX_LAT.div(2).add(1)
  );

  const gpsCoords = gwCoord.toGPS();

  const bl = gpsCoords[0];
  const br = gpsCoords[1];
  const tr = gpsCoords[2];
  const tl = gpsCoords[3];

  expect(bl[0].toFixed(10)).toEqual("0.0000000000");
  expect(bl[1].toFixed(10)).toEqual("0.0000000000");
  expect(br[0].toFixed(10)).toEqual("0.0006866455");
  expect(br[1].toFixed(10)).toEqual("0.0000000000");
  expect(tr[0].toFixed(10)).toEqual("0.0006866455");
  expect(tr[1].toFixed(10)).toEqual("0.0006866455");
  expect(tl[0].toFixed(10)).toEqual("0.0000000000");
  expect(tl[1].toFixed(10)).toEqual("0.0006866455");
});

test("To GPS Meridian", () => {
  const gwCoord = GeoWebCoordinate.fromXandY(DEFAULT_GW_MAX_LON, "131072");

  const gpsCoords = gwCoord.toGPS();

  const bl = gpsCoords[0];
  const br = gpsCoords[1];
  const tr = gpsCoords[2];
  const tl = gpsCoords[3];

  expect(bl[0].toFixed(10)).toEqual("179.9993133544");
  expect(bl[1].toFixed(10)).toEqual("0.0000000000");
  expect(br[0].toFixed(10)).toEqual("180.0000000000");
  expect(br[1].toFixed(10)).toEqual("0.0000000000");
  expect(tr[0].toFixed(10)).toEqual("180.0000000000");
  expect(tr[1].toFixed(10)).toEqual("0.0006866455");
  expect(tl[0].toFixed(10)).toEqual("179.9993133544");
  expect(tl[1].toFixed(10)).toEqual("0.0006866455");
});

test("To GPS North Pole", () => {
  const gwCoord = GeoWebCoordinate.fromXandY("262144", DEFAULT_GW_MAX_LAT);

  const gpsCoords = gwCoord.toGPS();

  const bl = gpsCoords[0];
  const br = gpsCoords[1];
  const tr = gpsCoords[2];
  const tl = gpsCoords[3];

  expect(bl[0].toFixed(10)).toEqual("0.0000000000");
  expect(bl[1].toFixed(10)).toEqual("89.9993133544");
  expect(br[0].toFixed(10)).toEqual("0.0006866455");
  expect(br[1].toFixed(10)).toEqual("89.9993133544");
  expect(tr[0].toFixed(10)).toEqual("0.0006866455");
  expect(tr[1].toFixed(10)).toEqual("90.0000000000");
  expect(tl[0].toFixed(10)).toEqual("0.0000000000");
  expect(tl[1].toFixed(10)).toEqual("90.0000000000");
});

test("To GPS Lon Out Of Bounds", () => {
  const gwCoord = GeoWebCoordinate.fromXandY(DEFAULT_GW_MAX_LON.add(1), "0");

  expect(() => gwCoord.toGPS()).toThrow();
});

test("To GPS Lat Out Of Bounds", () => {
  const gwCoord = GeoWebCoordinate.fromXandY("0", DEFAULT_GW_MAX_LAT.add(1));

  expect(() => gwCoord.toGPS()).toThrow();
});

test("Append Path Empty", () => {
  const path = BigNumber.from(0);
  const direction = BigNumber.from(0b10);

  const newPath = GeoWebCoordinate.appendToPath(path, direction);

  expect(toBN(newPath).toString(2)).toEqual(
    "100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010"
  );
});

test("Append Path Multiple", () => {
  let newPath = GeoWebCoordinate.appendToPath(
    BigNumber.from(0),
    BigNumber.from(0b10)
  );
  newPath = GeoWebCoordinate.appendToPath(newPath, BigNumber.from(0b00));
  newPath = GeoWebCoordinate.appendToPath(newPath, BigNumber.from(0b01));
  newPath = GeoWebCoordinate.appendToPath(newPath, BigNumber.from(0b01));
  newPath = GeoWebCoordinate.appendToPath(newPath, BigNumber.from(0b11));

  expect(toBN(newPath).toString(2)).toEqual(
    "10100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001101010010"
  );
});

test("Append Path Too Long", () => {
  expect(() =>
    GeoWebCoordinate.appendToPath(
      BigNumber.from(125).shl(248),
      BigNumber.from(0b10)
    )
  ).toThrow();
});

test("Make Rect Path Single", () => {
  const sourceCoord = GeoWebCoordinate.fromXandY("0", "0");
  const destCoord = GeoWebCoordinate.fromXandY("0", "0");

  const paths = GeoWebCoordinate.makeRectPath(sourceCoord, destCoord);
  expect(paths.length).toEqual(0);
});

test("Make Rect Path Square 1", () => {
  const sourceCoord = GeoWebCoordinate.fromXandY("0", "0");
  const destCoord = GeoWebCoordinate.fromXandY("2", "2");

  const paths = GeoWebCoordinate.makeRectPath(sourceCoord, destCoord);
  const expectedPath = makePathPrefix(8).or(BigNumber.from(0b1010001111001010));
  expect(paths.length).toEqual(1);
  expect(toBN(paths[0]).toString(2)).toEqual(toBN(expectedPath).toString(2));
});

test("Make Rect Path Square 2", () => {
  const sourceCoord = GeoWebCoordinate.fromXandY("2", "2");
  const destCoord = GeoWebCoordinate.fromXandY("0", "0");

  const paths = GeoWebCoordinate.makeRectPath(sourceCoord, destCoord);
  const expectedPath = makePathPrefix(8).or(BigNumber.from(0b1111011010011111));
  expect(paths.length).toEqual(1);
  expect(toBN(paths[0]).toString(2)).toEqual(toBN(expectedPath).toString(2));
});

test("Make Rect Path Square 3", () => {
  const sourceCoord = GeoWebCoordinate.fromXandY("0", "2");
  const destCoord = GeoWebCoordinate.fromXandY("2", "0");

  const paths = GeoWebCoordinate.makeRectPath(sourceCoord, destCoord);
  const expectedPath = makePathPrefix(8).or(BigNumber.from(0b1010011111011010));
  expect(paths.length).toEqual(1);
  expect(toBN(paths[0]).toString(2)).toEqual(toBN(expectedPath).toString(2));
});

test("Make Rect Path Square 4", () => {
  const sourceCoord = GeoWebCoordinate.fromXandY("2", "0");
  const destCoord = GeoWebCoordinate.fromXandY("0", "2");

  const paths = GeoWebCoordinate.makeRectPath(sourceCoord, destCoord);
  const expectedPath = makePathPrefix(8).or(BigNumber.from(0b1111001010001111));
  expect(paths.length).toEqual(1);
  expect(toBN(paths[0]).toString(2)).toEqual(toBN(expectedPath).toString(2));
});

test("Make Rect Path Rect 1", () => {
  const sourceCoord = GeoWebCoordinate.fromXandY("0", "0");
  const destCoord = GeoWebCoordinate.fromXandY("2", "3");

  const paths = GeoWebCoordinate.makeRectPath(sourceCoord, destCoord);
  const expectedPath = makePathPrefix(11).or(
    BigNumber.from(0b1111001010001111001010)
  );
  expect(paths.length).toEqual(1);
  expect(toBN(paths[0]).toString(2)).toEqual(toBN(expectedPath).toString(2));
});

test("Make Rect Path Rect 2", () => {
  const sourceCoord = GeoWebCoordinate.fromXandY("0", "0");
  const destCoord = GeoWebCoordinate.fromXandY("3", "2");

  const paths = GeoWebCoordinate.makeRectPath(sourceCoord, destCoord);
  const expectedPath = makePathPrefix(11).or(
    BigNumber.from(0b1010100011111100101010)
  );
  expect(paths.length).toEqual(1);
  expect(toBN(paths[0]).toString(2)).toEqual(toBN(expectedPath).toString(2));
});

test("Make Rect East Line", () => {
  const sourceCoord = GeoWebCoordinate.fromXandY("0", "0");
  const destCoord = GeoWebCoordinate.fromXandY("2", "0");

  const paths = GeoWebCoordinate.makeRectPath(sourceCoord, destCoord);
  const expectedPath = makePathPrefix(2).or(BigNumber.from(0b1010));
  expect(paths.length).toEqual(1);
  expect(toBN(paths[0]).toString(2)).toEqual(toBN(expectedPath).toString(2));
});

test("Make Rect West Line", () => {
  const sourceCoord = GeoWebCoordinate.fromXandY("2", "0");
  const destCoord = GeoWebCoordinate.fromXandY("0", "0");

  const paths = GeoWebCoordinate.makeRectPath(sourceCoord, destCoord);
  const expectedPath = makePathPrefix(2).or(BigNumber.from(0b1111));
  expect(paths.length).toEqual(1);
  expect(toBN(paths[0]).toString(2)).toEqual(toBN(expectedPath).toString(2));
});

test("Make Rect North Line", () => {
  const sourceCoord = GeoWebCoordinate.fromXandY("0", "0");
  const destCoord = GeoWebCoordinate.fromXandY("0", "2");

  const paths = GeoWebCoordinate.makeRectPath(sourceCoord, destCoord);
  const expectedPath = makePathPrefix(2).or(BigNumber.from(0b0000));
  expect(paths.length).toEqual(1);
  expect(toBN(paths[0]).toString(2)).toEqual(toBN(expectedPath).toString(2));
});

test("Make Rect South Line", () => {
  const sourceCoord = GeoWebCoordinate.fromXandY("0", "2");
  const destCoord = GeoWebCoordinate.fromXandY("0", "0");

  const paths = GeoWebCoordinate.makeRectPath(sourceCoord, destCoord);
  const expectedPath = makePathPrefix(2).or(BigNumber.from(0b0101));
  expect(paths.length).toEqual(1);
  expect(toBN(paths[0]).toString(2)).toEqual(toBN(expectedPath).toString(2));
});

test("Make Long Path", () => {
  const sourceCoord = GeoWebCoordinate.fromXandY("0", "0");
  const destCoord = GeoWebCoordinate.fromXandY("0", "200");

  const paths = GeoWebCoordinate.makeRectPath(sourceCoord, destCoord);
  expect(paths.length).toEqual(2);
  expect(toBN(paths[0]).toString(2)).toEqual(
    toBN(makePathPrefix(124)).toString(2)
  );
  expect(toBN(paths[1]).toString(2)).toEqual(
    toBN(makePathPrefix(76)).toString(2)
  );
});
