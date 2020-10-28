const BN = require("bn.js");

const GW_MAX_LAT = new BN(2 ** 23).subn(1);
const GW_MAX_LON = new BN(2 ** 24).subn(1);
const GW_INCRE = new BN("21457672119140625");

function from_gps(lon, lat) {
  if (lat < -90 || lat >= 90) {
    throw new Error("Latitude must be between -90 and <90");
  }
  if (lon < -180 || lon >= 180) {
    throw new Error("Longitude must be between -180 and <180");
  }

  // Lose precision of GPS coordinates after 10 digits
  let latNorm = new BN((lat + 90) * 10 ** 10).mul(new BN(10).pow(new BN(11)));
  let lonNorm = new BN((lon + 180) * 10 ** 10).mul(new BN(10).pow(new BN(11)));

  let latGW = new BN(latNorm).div(GW_INCRE);
  let lonGW = new BN(lonNorm).div(GW_INCRE);

  return lonGW.shln(32).or(latGW);
}

// Note: to_gps will round results to nearest 10 digits.
// This may result in small rounding errors that makes converting to and from coordinates not deterministic
function to_gps(gwCoord) {
  if (!BN.isBN(gwCoord)) {
    throw new Error("GeoWebCoordinate should be a BN");
  }

  let lonGW = gwCoord.shrn(32);
  let latGW = gwCoord.and(new BN(2 ** 32 - 1));

  if (lonGW.gt(GW_MAX_LON)) {
    throw new Error("Longitude is out of bounds");
  }
  if (latGW.gt(GW_MAX_LAT)) {
    throw new Error("Latitude is out of bounds");
  }

  const MULTIPLIER = new BN(10).pow(new BN(21));

  let bl_lon = lonGW.mul(GW_INCRE).sub(new BN(180).mul(MULTIPLIER));
  let bl_lat = latGW.mul(GW_INCRE).sub(new BN(90).mul(MULTIPLIER));

  let tr_lon = bl_lon.add(GW_INCRE);
  let tr_lat = bl_lat.add(GW_INCRE);

  let br_lon = tr_lon;
  let br_lat = bl_lat;

  let tl_lon = bl_lon;
  let tl_lat = tr_lat;

  return [
    [_to_gps_decimal(bl_lon), _to_gps_decimal(bl_lat)],
    [_to_gps_decimal(br_lon), _to_gps_decimal(br_lat)],
    [_to_gps_decimal(tr_lon), _to_gps_decimal(tr_lat)],
    [_to_gps_decimal(tl_lon), _to_gps_decimal(tl_lat)],
  ];
}

function make_gw_coord(x, y) {
  return new BN(x).shln(32).or(new BN(y));
}

function _to_gps_decimal(c) {
  // Round to 10 digits from 21
  // Convert to decimal
  return c.div(new BN(10).pow(new BN(11))).toNumber() / 10 ** 10;
}

var GeoWebCoordinate = {
  from_gps: from_gps,
  to_gps: to_gps,
  make_gw_coord: make_gw_coord,
};

module.exports = GeoWebCoordinate;
