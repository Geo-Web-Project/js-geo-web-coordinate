# js-geo-web-coordinate

A Javascript implementation of converting `GeoWebCoordinate` to GPS coordinates. See the [spec](https://github.com/Geo-Web-Project/specs/blob/master/contracts/GeoWebParcel.md#converting-coordinates).

## Install

```
npm install js-geo-web-coordinate
```

## Usage

### Convert GPS -> Geo Web Coordinate

```javascript
const GeoWebCoordinate = require("js-geo-web-coordinate");

let lon = 110.0;
let lat = 38.0;

let gwCoord = GeoWebCoordinate.from_gps(lon, lat);
```

### Convert Geo Web Coordinate -> GPS Bounding Box

```javascript
const GeoWebCoordinate = require("js-geo-web-coordinate");

let gpsCoords = GeoWebCoordinate.to_gps(gwCoord);
```

**Note**: Calculating bounding boxes will round results to the nearest 10 digits. This may result in small rounding errors when calculating bounding boxes of a coordinate.

## Tests

See tests for more usage.

```
npm test
```
