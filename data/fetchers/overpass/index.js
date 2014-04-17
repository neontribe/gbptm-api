var fs = require('fs'),
    path = require('path'),
    through = require('through'),
    JSONStream = require('JSONStream'),
    osmtogeojson = require('osmtogeojson'),
    request = require('request');

/**
 * stream to convert osm json objects to geojson
 * expects to be fed with an object mode stream of individual entries
 * currently has a problem with ways...
 * @return {Stream}
 */
function geojsonify(){
    return through(function write(data){
        //osmtogeojson expects to operate on an osm wrapper so we fake one
        var osmw = {elements:[data]},
            fc = osmtogeojson(osmw),
            f = fc.features[0];
        // queue up the single entry from the feature collection if we got one
        if (f) {
            this.queue(f);
        }
        
    });
}

function items(qfile, endpoint) {
    var out = through();
    fs.createReadStream(qfile || path.join(__dirname, 'overpass-query-amenities-toilets-norwich.xml'))
        .pipe(request.post(endpoint || 'http://overpass-api.de/api/interpreter'))
        .pipe(JSONStream.parse(['elements', true]))
        .pipe(geojsonify())
        .pipe(out);
    return out;
}

module.exports = items;
