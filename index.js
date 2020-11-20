const BN = require("bn.js");

const GW_MAX_LAT = new BN(2 ** 23).subn(1);
const GW_MAX_LON = new BN(2 ** 24).subn(1);
const GW_INCRE = new BN("21457672119140625");

const DIR_NORTH = new BN("00", 2);
const DIR_SOUTH = new BN("01", 2);
const DIR_EAST = new BN("10", 2);
const DIR_WEST = new BN("11", 2);

const INNER_PATH_MASK = new BN(1).shln(256 - 8).subn(1);
const MAX_PATH_LEN = 256 / 8 / 2;

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

  let lonGW = get_x(gwCoord);
  let latGW = get_y(gwCoord);

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

function get_x(gwCoord) {
  return gwCoord.shrn(32);
}

function get_y(gwCoord) {
  return gwCoord.and(new BN(2 ** 32 - 1));
}

function make_gw_coord(x, y) {
  return new BN(x).shln(32).or(new BN(y));
}

// Make a rectangular path between two coordinates
function make_rect_path(sourceCoord, destCoord) {
  _validate_coord(sourceCoord);
  _validate_coord(destCoord);

  let x_s = get_x(sourceCoord);
  let y_s = get_y(sourceCoord);

  let x_d = get_x(destCoord);
  let y_d = get_y(destCoord);

  let paths = [];
  let path = new BN(0);

  function _append(direction) {
    if (path_length(path) >= MAX_PATH_LEN) {
      // Add to new path
      paths.push(path);
      path = new BN(0);
    }

    path = append_to_path(path, direction);
  }

  for (let y_offset = 0; y_offset <= Math.abs(y_d - y_s); y_offset++) {
    for (let x_offset = 0; x_offset < Math.abs(x_d - x_s); x_offset++) {
      // Each column
      let dir_even = x_d > x_s ? DIR_EAST : DIR_WEST;
      let dir_odd = x_d > x_s ? DIR_WEST : DIR_EAST;
      let direction_x = y_offset % 2 == 0 ? dir_even : dir_odd;
      _append(direction_x);
    }

    // Each row
    if (y_offset < Math.abs(y_d - y_s)) {
      let direction_y = y_d > y_s ? DIR_NORTH : DIR_SOUTH;
      _append(direction_y);
    }
  }

  paths.push(path);

  return paths;
}

function append_to_path(path, direction) {
  if (!BN.isBN(direction)) {
    throw new Error("Direction should be a BN");
  }
  if (direction > 3) {
    throw new Error("Direction is out of range");
  }
  if (!BN.isBN(path)) {
    throw new Error("Path should be a BN");
  }

  let length = path_length(path);
  if (length >= MAX_PATH_LEN) {
    throw new Error("Path is at maximum length");
  }

  let newLength = length.addn(1).shln(256 - 8);

  let newPath = newLength.or(
    path.and(INNER_PATH_MASK).or(direction.shln(length * 2))
  );
  return newPath;
}

function path_length(path) {
  return path.shrn(256 - 8);
}

function _validate_coord(coord) {
  if (!BN.isBN(coord)) {
    throw new Error("GeoWebCoordinate should be a BN");
  }

  if (get_x(coord).gt(GW_MAX_LON)) {
    throw new Error("Longitude is out of bounds");
  }
  if (get_y(coord).gt(GW_MAX_LAT)) {
    throw new Error("Latitude is out of bounds");
  }
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
  get_x: get_x,
  get_y: get_y,
  append_to_path: append_to_path,
  make_rect_path: make_rect_path,
};

module.exports = GeoWebCoordinate;
