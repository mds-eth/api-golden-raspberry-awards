import * as yup from 'yup';

import { YEARS_WITH_MULTIPLE_WINNERS, STUDIOS_WITH_WIN_COUNT, MAX_MIN_WIN_INTERVAL_FOR_PRODUCERS } from '../constants';

export const awardsListSchema = yup.object().shape({
  page: yup.number().required('Page is required'),
  size: yup.number().required('Size is required'),
  winner: yup.boolean().label('Winner is boolean'),
  year: yup
    .number()
    .typeError('Year must be a number')
    .integer('Year must be an integer')
    .min(1000, 'Year must be a 4-digit number')
    .max(9999, 'Year must be a 4-digit number')
});

export const awardsByYearSchema = yup.object().shape({
  year: yup
    .number()
    .typeError('Year must be a number')
    .integer('Year must be an integer')
    .min(1000, 'Year must be a 4-digit number')
    .max(9999, 'Year must be a 4-digit number')
    .required('Year is required'),
});

export const awardsProjectionSchema = yup.object().shape({
  projection: yup
    .string()
    .oneOf(
      [YEARS_WITH_MULTIPLE_WINNERS, STUDIOS_WITH_WIN_COUNT, MAX_MIN_WIN_INTERVAL_FOR_PRODUCERS],
      'Projection must be one of the allowed constants'
    )
    .required('Projection is required'),
});
