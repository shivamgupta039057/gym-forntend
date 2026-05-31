import * as Yup from 'yup';

export const NotExistPatientSchema =  Yup.object().shape({
  NameOfPatient: Yup.string().required('Patient name is required'),
  mobile: Yup.string()
    .matches(/^[0-9]+$/, 'Mobile number should only contain digits')
    .required('Mobile number is required'),
  patientDate: Yup.date().required('Ticket date is required').nullable(),
  address: Yup.string().required('Address is required'),
  gender: Yup.string()
    .required('Gender is required'),
  age: Yup.number()
    .positive('Age must be a positive number')
    .integer('Age must be an integer')
    .required('Age is required'),
  description: Yup.string().required('Description is required'),
  amount: Yup.number()
    .positive('Amount must be a positive number')
    .required('Amount is required'),
  note: Yup.string().required('Note is required'),
  relationship: Yup.string().required('Relationship is required'),
    
});
