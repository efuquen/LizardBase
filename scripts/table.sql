CREATE TABLE gis.geom(
  geoId serial,
  locId integer not null,
  specId integer not null,
  userId integer not null,
  tsAdded timestamp default current_timestamp
);

SELECT AddGeometryColumn( 'gis', 'geom', 'geom', 4326, 'POINT', 2);
