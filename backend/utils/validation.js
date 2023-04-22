// backend/utils/validation.js
const { validationResult } = require('express-validator');
const { check } = require('express-validator');
const { Op } = require('sequelize')
const {Booking } = require('../db/models');
// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);
    console.log(errors)
    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const handleOverlapErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);
    console.log(errors)
    const err = Error("Sorry, this spot is already booked for the specified dates");
    err.errors = errors;
    err.status = 403;
    err.title = "Conflicting Dates";
    next(err);
  }
  next();
}
const validateEditSpot = [
  check('address')
      .optional()
      .isLength({min: 1, max: 30}).withMessage('address must be between 1 and 30 character'),
  check('city')
      .optional()
      .isLength({min: 1, max: 30}).withMessage('city must be between 1 and 30 characters'),
  check('state')
      .optional()
      .isLength({min: 1, max: 30}).withMessage('state must be between 1 and 30 characters'),
  check('country')
      .optional()
      .isLength({min: 1, max: 30}).withMessage('country must be between 1 and 30 characters'),
  check('lat')
      .optional()
      .isFloat({min: -90, max: 90}).withMessage('Invalid latitude. lat must be between -90 and 90'),
  check('lng')
      .optional()
      .isFloat({min: -180, max: 180}).withMessage('Invalid longitude. lng must be between -180 and 180'),
  check('name')
      .optional()
      .isLength({min: 1, max: 30}).withMessage('name must be between 1 and 30 characters'),
  check('description')
      .optional()
      .isLength({min: 1, max: 2048}).withMessage('description must be between 1 and 2048 characters'),
  check('price')
      .optional()
      .isFloat({min: 0}).withMessage('price must be more than 0'),
  handleValidationErrors
]

const validateCreateSpot = [
  check('address')
      .not().isEmpty()
      .isLength({min: 1, max: 30}).withMessage('address is required and must be between 1 and 30 character'),
  check('city')
      .not().isEmpty()
      .isLength({min: 1, max: 30}).withMessage('city is required and must be between 1 and 30 characters'),
  check('state')
      .not().isEmpty()
      .isLength({min: 1, max: 30}).withMessage('state is required and  must be between 1 and 30 characters'),
  check('country')
      .not().isEmpty()
      .isLength({min: 1, max: 30}).withMessage('country is required and must be between 1 and 30 characters'),
  check('lat')
      .not().isEmpty()
      .isFloat({min: -90, max: 90}).withMessage('Invalid latitude. lat must be between -90 and 90'),
  check('lng')
      .not().isEmpty()
      .isFloat({min: -180, max: 180}).withMessage('Invalid longitude. lng must be between -180 and 180'),
  check('name')
      .not().isEmpty()
      .isLength({min: 1, max: 30}).withMessage('name is required and must be between 1 and 30 characters'),
  check('description')
      .not().isEmpty()
      .isLength({min: 5, max: 2048}).withMessage('description is required and must be between 5 and 2048 characters'),
  check('price')
      .not().isEmpty()
      .isFloat({min: 0}).withMessage('price is required and  must be more than 0'),
  handleValidationErrors
]

const validateCreateReview = [
  check('review')
    .not().isEmpty()
    .isLength({min: 5, max: 2048}).withMessage('review is required and must be between 5 and 2048 characters'),
  check('stars')
    .not().isEmpty()
    .isInt({min: 1, max: 5}).withMessage('stars is required and must be an integer between 1 and 5'),
  handleValidationErrors
]

const validateEditReview = [
  check('review')
    .isLength({min: 5, max: 2048}).withMessage('review is required and must be between 5 and 2048 characters')
    .optional(),
  check('stars')
    .isInt({min: 1, max: 5}).withMessage('stars is required and must be an integer between 1 and 5')
    .optional(),
  handleValidationErrors
]

const validateCreateBooking = [
  check('endDate')
    .not().isEmpty()
    .isDate().withMessage('End Date must be a date in the form YYYY-MM-DD'),
  check('startDate')
    .not().isEmpty()
    .isDate().withMessage('Start Date must be a date in the form YYYY-MM-DD'),
  check('startDate')
    .custom((value, {req}) => {
      if (new Date(value) > new Date(req.body.endDate)) {
        throw new Error('End date must be after start date.');
      }
      return true;
    }),
    handleValidationErrors
]

const validateCreateBookingsOverlap = [
  check('startDate')
    .custom( async (value, {req}) => {
      const { spotId } = req.params;
      const overlap = await Booking.findOne({
        where: {
          spotId,
          [Op.or]: [
            {
              startDate: {[Op.lte]: value},
              endDate: {[Op.gte]: value}
            },
          ]
        }
      });
      if(overlap) {
        throw new Error('Start date conflicts with an existing booking')
      }
      return true;
    }),
    check('endDate')
    .custom( async (value, {req}) => {
      const { spotId } = req.params;
      const overlap = await Booking.findOne({
        where: {
          spotId,
          [Op.or]: [
            {
              startDate: {[Op.lte]: value},
              endDate: {[Op.gte]: value}
            },
          ]
        }
      });
      if(overlap) {
        throw new Error('End date conflicts with an existing booking')
      }
      return true;
    }),
  handleOverlapErrors
]

module.exports = {
  handleValidationErrors,
  validateEditSpot,
  validateCreateSpot,
  validateCreateReview,
  validateEditReview,
  validateCreateBooking,
  validateCreateBookingsOverlap
};