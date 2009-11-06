DROP SCHEMA gis CASCADE;
CREATE SCHEMA gis;

CREATE TABLE gis.specimen(
  specId serial,
  label char( 16 ) not null,
  year char( 4 ),
  sex char( 1 ) not null,
  measurements float[] not null,
  userId integer not null,
  tsAdded timestamp default current_timestamp,
  unique ( label )
);

CREATE TABLE gis.location(
  locId serial,
  name varchar( 64 ) not null,
  county varchar( 64 ) not null,
  state varchar( 64 ) not null,
  country varchar( 64 ) not null,
  userId integer not null,
  tsAdded timestamp default current_timestamp,
  unique ( name, county, state, country )
);

CREATE TABLE gis.geom(
  geoId serial,
  locId integer not null references gis.location(locId),
  specId integer not null references gis.specimen(specId),
  userId integer not null,
  tsAdded timestamp default current_timestamp,
  unique ( specId )
);

SELECT AddGeometryColumn( 'gis', 'geom', 'geom', 4326, 'POINT', 2);

CREATE View gis.features AS SELECT g.geoid, g.geom, s.label, s.year, s.sex, l.name, l.county, l.state, l.country, s.measurements
FROM gis.geom g
JOIN gis.location l USING (locid)
JOIN gis.specimen s USING (specid);
