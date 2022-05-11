import { BigNumber } from "ethers";

const DEFAULT_GW_MAX_LAT = BigNumber.from(2 ** 18).sub(1);
const DEFAULT_GW_MAX_LON = BigNumber.from(2 ** 19).sub(1);
const GW_INCRE = BigNumber.from("686645507812500000");

const DIR_NORTH = BigNumber.from(0b00);
const DIR_SOUTH = BigNumber.from(0b01);
const DIR_EAST = BigNumber.from(0b10);
const DIR_WEST = BigNumber.from(0b11);

const INNER_PATH_MASK = BigNumber.from(1)
  .shl(256 - 8)
  .sub(1);
const MAX_PATH_LEN = (256 - 8) / 2;

export class GeoWebCoordinate {
  private _value: BigNumber;
  private _maxLat: BigNumber;
  private _maxLon: BigNumber;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(value: any, lonDim?: number, latDim?: number) {
    this._maxLat = latDim
      ? BigNumber.from(2 ** latDim).sub(1)
      : DEFAULT_GW_MAX_LAT;
    this._maxLon = lonDim
      ? BigNumber.from(2 ** lonDim).sub(1)
      : DEFAULT_GW_MAX_LON;
    this._value = BigNumber.from(value);
  }

  static fromGPS(
    lon: number,
    lat: number,
    lonDim?: number,
    latDim?: number
  ): GeoWebCoordinate {
    if (lat < -90 || lat >= 90) {
      throw new Error("Latitude must be between -90 and <90");
    }
    if (lon < -180 || lon >= 180) {
      throw new Error("Longitude must be between -180 and <180");
    }

    // Lose precision of GPS coordinates after 10 digits
    const latNorm = BigNumber.from((lat + 90) * 10 ** 10).mul(
      BigNumber.from(10).pow(BigNumber.from(11))
    );
    const lonNorm = BigNumber.from((lon + 180) * 10 ** 10).mul(
      BigNumber.from(10).pow(BigNumber.from(11))
    );

    const latGW = BigNumber.from(latNorm).div(GW_INCRE);
    const lonGW = BigNumber.from(lonNorm).div(GW_INCRE);

    return new GeoWebCoordinate(lonGW.shl(32).or(latGW), lonDim, latDim);
  }

  // Note: toGPS will round results to nearest 10 digits.
  // This may result in small rounding errors that makes converting to and from coordinates not deterministic
  toGPS() {
    const lonGW = this.getX();
    const latGW = this.getY();

    if (lonGW.gt(this._maxLon)) {
      throw new Error("Longitude is out of bounds");
    }
    if (latGW.gt(this._maxLat)) {
      throw new Error("Latitude is out of bounds");
    }

    const MULTIPLIER = BigNumber.from(10).pow(BigNumber.from(21));

    const bl_lon = lonGW.mul(GW_INCRE).sub(BigNumber.from(180).mul(MULTIPLIER));
    const bl_lat = latGW.mul(GW_INCRE).sub(BigNumber.from(90).mul(MULTIPLIER));

    const tr_lon = bl_lon.add(GW_INCRE);
    const tr_lat = bl_lat.add(GW_INCRE);

    const br_lon = tr_lon;
    const br_lat = bl_lat;

    const tl_lon = bl_lon;
    const tl_lat = tr_lat;

    return [
      [this._toGPSDecimal(bl_lon), this._toGPSDecimal(bl_lat)],
      [this._toGPSDecimal(br_lon), this._toGPSDecimal(br_lat)],
      [this._toGPSDecimal(tr_lon), this._toGPSDecimal(tr_lat)],
      [this._toGPSDecimal(tl_lon), this._toGPSDecimal(tl_lat)],
    ];
  }

  getX() {
    return this._value.shr(32);
  }

  getY() {
    return this._value.and(BigNumber.from(2 ** 32 - 1));
  }

  static fromXandY(x: number, y: number) {
    return BigNumber.from(x).shl(32).or(BigNumber.from(y));
  }

  // Make a rectangular path between two coordinates
  static makeRectPath(
    sourceCoord: GeoWebCoordinate,
    destCoord: GeoWebCoordinate
  ) {
    sourceCoord.validate();
    destCoord.validate();

    const x_s = sourceCoord.getX();
    const y_s = sourceCoord.getY();

    const x_d = destCoord.getX();
    const y_d = destCoord.getY();

    const paths = [];
    let path = BigNumber.from(0);

    function _append(direction: BigNumber) {
      if (GeoWebCoordinate.pathLength(path).gte(MAX_PATH_LEN)) {
        // Add to new path
        paths.push(path);
        path = BigNumber.from(0);
      }

      path = GeoWebCoordinate.appendToPath(path, direction);
    }

    for (
      let y_offset = 0;
      y_offset <= y_d.sub(y_s).abs().toNumber();
      y_offset++
    ) {
      for (
        let x_offset = 0;
        x_offset < x_d.sub(x_s).abs().toNumber();
        x_offset++
      ) {
        // Each column
        const dir_even = x_d > x_s ? DIR_EAST : DIR_WEST;
        const dir_odd = x_d > x_s ? DIR_WEST : DIR_EAST;
        const direction_x = y_offset % 2 == 0 ? dir_even : dir_odd;
        _append(direction_x);
      }

      // Each row
      if (y_offset < y_d.sub(y_s).abs().toNumber()) {
        const direction_y = y_d > y_s ? DIR_NORTH : DIR_SOUTH;
        _append(direction_y);
      }
    }

    if (GeoWebCoordinate.pathLength(path).gt(0)) {
      paths.push(path);
    }

    return paths;
  }

  static appendToPath(path: BigNumber, direction: BigNumber) {
    if (direction.gt(3)) {
      throw new Error("Direction is out of range");
    }

    const length = GeoWebCoordinate.pathLength(path);
    if (length.gte(MAX_PATH_LEN)) {
      throw new Error("Path is at maximum length");
    }

    const newLength = length.add(1).shl(256 - 8);

    const newPath = newLength.or(
      path.and(INNER_PATH_MASK).or(direction.shl(length.mul(2).toNumber()))
    );
    return newPath;
  }

  static pathLength(path: BigNumber) {
    return path.shr(256 - 8);
  }

  validate() {
    if (this.getX().gt(this._maxLon)) {
      throw new Error("Longitude is out of bounds");
    }
    if (this.getY().gt(this._maxLat)) {
      throw new Error("Latitude is out of bounds");
    }
  }

  _toGPSDecimal(v: BigNumber) {
    // Round to 10 digits from 21
    // Convert to decimal
    return (
      v.div(BigNumber.from(10).pow(BigNumber.from(11))).toNumber() / 10 ** 10
    );
  }
}
