const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

// our APIs old report model
const LegacyReport = require('@neontribe/gbptm-api/src/models/loo_report');

/**
 * The core schema of a loo and loo report. This is as a function because:
 * - It will give a new object instance each time, protecting against mutation
 * - There may be subtle differences in validation between reports and loos
 * This is volatile work in progress.
 */
function getCoreSchema() {
  return {
    geometry: {
      type: {
        type: String,
        required: '"{PATH}" should be "Point" and is required',
      },
      coordinates: [{ type: 'Number' }],
    },
    name: { type: String },
    active: { type: Boolean, default: true },
    access: { type: String, default: 'public' },
    opening: { type: String },
    type: { type: String },
    accessibleType: { type: String },
    disposal: { type: String },
    babyChange: { type: String },
    babyChangeLocation: { type: String },
    changingPlace: { type: String },
    familyToilet: { type: String },
    radar: { type: String },
    attended: { type: String },
    automatic: { type: String },
    parking: { type: Boolean },
    fee: { type: String },
    streetAddress: { type: String },
    postcode: { type: String },
    operator: { type: String },
    reportEmail: { type: String },
    reportPhone: { type: String },
    notes: { type: String },
    infoUrl: { type: String },
    architecturalInterest: { type: String },
    historicalInterest: { type: String },
    geocoded: { type: Boolean },
    geocoding_method: { type: String },
    orig: { type: Object },
    removal_reason: { type: String },
    area: [
      {
        type: { type: String },
        name: { type: String },
      },
    ],
  };
}

exports.Report = mongoose.model(
  'Report',
  new Schema({
    diff: getCoreSchema(),
  })
);
exports.LegacyReport = LegacyReport;