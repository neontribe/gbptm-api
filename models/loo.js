'use strict'

var mongoose = require('mongoose')
var looSchema = require('./loo_schema').looSchema
var config = require('../config/config')
var rp = require('request-promise')
var _ = require('lodash')
var earth = 6731000
var Loo

looSchema.statics.findNear = function (lon, lat, maxDistance, limit) {
  return this.aggregate([
    {
      $geoNear: {
        near: [parseFloat(lon), parseFloat(lat)],
        distanceField: 'distance',
        maxDistance: (parseFloat(maxDistance) / earth),
        limit: limit,
        distanceMultiplier: earth,
        spherical: true
      }
    },
    {
      $match: {
        'properties.active': true
      }
    }
  ])
}

looSchema.statics.findAllIds = function () {
  return this.find({}).select('id')
}

looSchema.statics.findIn = function (sw, ne, nw, se) {
  return this.find({
    'properties.active': true,
    geometry: {
      $geoIntersects: {
        $geometry: {
          type: 'Polygon',
          coordinates: [[
            _.map(sw.split(','), parseFloat),
            _.map(nw.split(','), parseFloat),
            _.map(ne.split(','), parseFloat),
            _.map(se.split(','), parseFloat),
            _.map(sw.split(','), parseFloat)
          ]]
        }
      }
    }
  })
}

looSchema.methods.toGeoJSON = function (app) {
  return this.toJSON()
}

function calculateCredibility (reports) {
  // score each report out of 20, 10 for trust 10 for completeness
  return _.reduce(reports, function (sum, rep) {
    var completeness = 0
    var penalties = 0
    var trust = rep.trust
    var props = _.size(
      _.filter(rep.properties, function (v) {
        return (!_.isFunction(v) && !_.isUndefined(v))
      })
    )
    if (props > 4) {
      completeness = 2
    }
    if (props > 5) {
      completeness = 3
    }
    if (props > 8) {
      completeness = 7
    }
    if (props > 12) {
      completeness = 9
    }
    if (props > 15) {
      completeness = 10
    }
    if (props.geocoded) {
      penalties += -8
    }
    return sum + ((trust + completeness) - penalties)
  }, 0) / reports.length
}

looSchema.methods.updateArea = function * () {
  var domain = 'http://mapit.mysociety.org/point/4326/' + this.geometry.coordinates[0] + ',' + this.geometry.coordinates[1] + '?api_key=' + config.mapit.apiKey

  var area = {}

  var options = {
    url: domain
  }

  var mapit = yield rp(options)

    // not sure why im getting a string back...need to investigate
  var mapitJSON = JSON.parse(mapit)

  var acceptableValues = ['District council', 'Unitary Authority', 'Metropolitan district', 'London borough']

  for (var property in mapitJSON) {
        // console.log(mapitJSON[property]['type_name'])
        // console.log(mapitJSON[property]['name'])
    if (acceptableValues.indexOf(mapitJSON[property]['type_name']) >= 0) {
      area[mapitJSON[property]['type_name']] = mapitJSON[property]['name']
    }
  }

  this.properties.area = area
  // yield this.save()
  return this
}

/**
 * Rebuild a loo's data by recompiling it from all the reports that have been attatched
 * Currently this leaves a loo's location as that of the most recent report submitted
 */
looSchema.methods.regenerate = function * () {
  // populate the array of report ids with their documents
  var loo = yield this.populate('reports').execPopulate()
  // Make an array of property objects ordered by trustworthiness then by freshness
  var properties = _.map(_.sortBy(loo.reports, ['trust', 'updatedAt']), 'properties')
  // Merge them together in that order
  loo.properties = _.merge.apply(_, properties)
  // Record all the sources and attributions
  loo.sources = _.map(loo.reports, 'origin')
  loo.attributions = _.map(loo.reports, 'attribution')

  // Potential coordinate solutions.
  var recentLooReports = _.remove(_.sortBy(loo.reports, ['updatedAt']), function (report) {
    if (report.updatedAt !== undefined) {
      return report
    }
  })
  var geometry = {type: 'Point', coordinates: []}

/*
  //Averages ALL reports
  geometry.coordinates[0] = _.meanBy(loo.reports, function(report) { return report.geometry.coordinates[0]; });
  geometry.coordinates[1] = _.meanBy(loo.reports, function(report) { return report.geometry.coordinates[1]; });
*/

  // The most recent user can just change the co-ordinates.
  geometry.coordinates[0] = recentLooReports[recentLooReports.length - 1].geometry.coordinates[0]
  geometry.coordinates[1] = recentLooReports[recentLooReports.length - 1].geometry.coordinates[1]

/*
  //Skewed average based on trust
  geometry.coordinates[0] = _.meanBy(loo.reports, function(report) { return report.geometry.coordinates[0]*report.trust;})/_.sumBy(trustedLooReports,'trust');
  geometry.coordinates[1] = _.meanBy(loo.reports, function(report) { return report.geometry.coordinates[1]*report.trust;})/_.sumBy(trustedLooReports,'trust');
*/

  this.geometry = geometry
  // attempt to update administrative geography data
  try {
    yield loo.updateArea()
  } catch (e) {
    console.log('updateArea failed during regenerate for Loo: ' + loo._id + '\n', e)
  }

  // Calculate credibility
  loo.credibility = calculateCredibility(loo.reports)
  return this
}

looSchema.statics.fromLooReport = function (report) {
  var base = _.pick(report.toJSON(), 'geometry', 'properties', 'type')
  var loo = new Loo(base)

  loo.reports.push(report._id)
  loo.sources.push(report.origin)
  loo.attributions.push(report.attribution)
  return loo
}

module.exports = Loo = mongoose.model('Loo', looSchema)
