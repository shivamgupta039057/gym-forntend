import * as Yup from 'yup';

export const DefaultValidationSchema = Yup.object().shape({
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, 'Must be a valid 10-digit number')
    .required('Mobile number is required'),
  relationship: Yup.string().required('Relationship is required'),
});

// export default DefaultValidationSchema;
