import * as Yup from 'yup';

export const ExistPatientSchema = Yup.object().shape({
  patientDate: Yup.date()
    .required('Patient date is required')
    .typeError('Invalid date'),
  specialization: Yup.array()
    .of(
      Yup.object().shape({
        medicineName: Yup.string().required('Specialization is required'),
        _id: Yup.string().required('Specialization ID is required'),
      })
    )
    .required('Specialization is required'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  amount: Yup.number()
    .required('Amount is required')
    .min(1, 'Amount must be greater than zero'),
  note: Yup.string()
    .required('Note is required')
    .min(5, 'Note must be at least 5 characters'),
  diagnostics: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Diagnostic name is required'),
        id: Yup.string().required('Diagnostic ID is required'),
      })
    )
    .required('Diagnostics are required'),
});
