
import java.sql.DriverManager

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

val dbUrl="jdbc:postgresql://localhost/chado"
val dbUser="linnaeus"
val dbPass="password"

val conn = DriverManager.getConnection( dbUrl, dbUser, dbPass )
val stmt = conn.createStatement
val reader = new CSVReader( new FileReader( new File( gisCsv ) ) )

var line = reader.readNext
line = reader.readNext
try {
  while ( line != null ) {

    /*val museum = line( 0 )
    val specId = line( 1 )
    val county = line( 2 )
    val state = line( 3 )
    val year = line( 4 ).toInt
    val sex = line( 5 )*/
    val lonStr = line( 6 )
    val latStr = line( 7 )

  
    if( lonStr != "" && latStr != "" ) {
      val lon = lonStr.toDouble
      val lat = latStr.toDouble

      val query = 
      """INSERT INTO gis.geom
      (locid,specid,userid,geom)
      VALUES
      (1,1,1, ST_GeomFromText( 'POINT(""" + lat + " " + lon + """)', 4326) )"""
      println( query )
      val updated = stmt.executeUpdate( query )
      if( updated == 1 ) {
        println( "Ok: Inserted point at " + lon + " " + lat )
      } else {
        println( "Error: Failed to insert point at " + lon + " " + lat )
      }
    }

    line = reader.readNext
  }
} finally {
  stmt.close
  conn.close
  reader.close
}
