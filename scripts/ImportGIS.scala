import java.sql.DriverManager
import java.sql.Statement

import java.io.FileReader
import java.io.File

import org.apache.commons.cli.Options
import org.apache.commons.cli.CommandLine
import org.apache.commons.cli.PosixParser

import au.com.bytecode.opencsv.CSVReader

val options = new Options
val parser = new PosixParser
val cmd = parser.parse( options, args);

var gisCsv: String = null

if( cmd.getArgList.size != 1 ) {
  println( "Missing required argument {gis csv file}" )
  System.exit( 0 )
} else {
  gisCsv = cmd.getArgList.get( 0 ).asInstanceOf[String]
}

Class.forName( "org.postgresql.Driver" )

val dbUrl="jdbc:postgresql://localhost/lizardbase"
val dbUser="linnaeus"
val dbPass="password"

val conn = DriverManager.getConnection( dbUrl, dbUser, dbPass )
conn.setAutoCommit( false )
val stmt = conn.createStatement
val reader = new CSVReader( new FileReader( new File( gisCsv ) ) )

var line = reader.readNext
line = reader.readNext
try {
  while ( line != null ) {

    val museum = line( 0 )
    val county = line( 2 )
    val state = line( 3 )

    val spec = line( 1 )
    val year = if( line( 4 ) == "n/a" ) { 0 } else { line( 4 ).toInt }
    val sex = line( 5 )

    val lonStr = line( 6 )
    val latStr = line( 7 )

    var index = 8
    var measurements: List[Double] = List[Double]() 
    while ( index < 18 ) {
      val num = if( line( index ) == "" ) { 0.0 } else { line( index ).toDouble }
      index += 1
      measurements = num :: measurements
    } 
  
    if( lonStr != "" && latStr != "" ) {
      val lon = lonStr.toDouble
      val lat = latStr.toDouble
      val userId = 1

      val locId = getLocId( museum, county, state, "United States", userId )
      val specId = getSpecId( spec, sex, year, measurements, userId )

      if( locId > 0 && specId > 0 ) {
        val query = 
        String.format( """INSERT INTO gis.geom
        (locid,specid,userid,geom)
        VALUES
        (%d,%d,%d, ST_GeomFromText( 'POINT( %f %f )', 4326) )""",
        long2Long( locId ), long2Long( specId ), long2Long( userId ), double2Double( lat ), double2Double( lon ) )
        val updated = stmt.executeUpdate( query )
        if( updated == 1 ) {
          println( "Ok: Inserted point at " + lon + " " + lat )
        } else {
          println( "Error: Failed to insert point at " + lon + " " + lat )
        }
        conn.commit
      } else {
        println( "Error: Bad ids " + locId + " " + specId )
      }
    }
    line = reader.readNext
  }
} finally {
  stmt.close
  conn.close
  reader.close
}

def getLocId( name: String, county: String, state: String, country: String, userId: Long ): Long = {
  getId(
    String.format( 
			"""SELECT locId FROM gis.location 
			WHERE name='%s' AND county='%s' AND state='%s' AND country='%s'""", name, county, state, country ),
    String.format(
        """INSERT INTO gis.location
        (name, county, state, country, userId)
        VALUES
        ('%s', '%s', '%s', '%s', %d)""", name, county, state, country, long2Long( userId ) )
        )
}

def getSpecId( label: String, sex: String, year: Int, measurements: Seq[Double], userId: Long): Long = {
  var measurementsStr = "{"
  for( measurement <- measurements ) {
    measurementsStr += measurement + ","
  }
  measurementsStr = measurementsStr.subSequence( 0, measurementsStr.size - 1 ).toString + "}"
  getId(
    String.format( "SELECT specId FROM gis.specimen WHERE label='%s'", label ),
    String.format(
      """INSERT INTO gis.specimen
      (label, year, sex, measurements, userId)
      VALUES
      ('%s', '%d', '%s', '%s', %d)""",
      label, int2Integer( year ), sex, measurementsStr, long2Long( userId ) )
    )
}

def getId ( selectQuery: String, insertQuery: String ): Long = {
  val stmt = conn.createStatement
  val rs = stmt.executeQuery( selectQuery )
  try {
    if( rs.next ) {
      rs.getLong( 1 )
    } else {
      val inserted = stmt.executeUpdate( insertQuery, Statement.RETURN_GENERATED_KEYS )
      conn.commit
      if( inserted == 1 ) {
        val genKeys = stmt.getGeneratedKeys
        try {
          if( genKeys.next ) {
            genKeys.getLong( 1 )
          } else {
            println( "Error: Can't get inserted id" )
            -1
          }
        } finally {
          genKeys.close
        }
      } else {
        println( "Error: Can't insert"  )
        -1
      }
    }
  } finally {
    rs.close
    stmt.close
  }
}
