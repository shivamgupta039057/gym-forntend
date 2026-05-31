import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ExistPatientSchema } from './schema/ExistPatientSchema';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DialogActions from '@mui/material/DialogActions';

interface AddPatientFormProps {
  handleSubmit: (values: any) => void;
  specializationList: Array<{ medicineName: string; _id: string }>;
  diagnostic: Array<{ name: string; id: string }>;
}

const ExistPatientForm: React.FC<AddPatientFormProps> = ({
  handleSubmit,
  specializationList,
  diagnostic,
}) => {
  const [selectedSpecializations, setSelectedSpecializations] = React.useState<
    { medicineName: string; _id: string }[]
  >([]);
  const [selectedDiagnostics, setSelectedDiagnostics] = React.useState<
    { name: string; id: string }[]
  >([]);

  return (
    <Formik
      initialValues={{
        patientDate: '',
        specialization: [],
        description: '',
        amount: '',
        note: '',
        diagnostics: [],
      }}
      validationSchema={ExistPatientSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Date */}
            <div>
              <label className="mb-3 block text-sm font-medium text-black">
                Patient Date
              </label>
              <Field
                name="patientDate"
                type="date"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <ErrorMessage
                name="patientDate"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

             {/* Amount */}
             <div>
              <label className="mb-3 block text-sm font-medium text-black">Amount</label>
              <Field
                name="amount"
                placeholder="Enter Amount"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <ErrorMessage
                name="amount"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Specialization */}
            <div>
              <Autocomplete
                multiple
                options={specializationList}
                getOptionLabel={(option) => option.medicineName}
                value={selectedSpecializations}
                onChange={(event, newValue) => {
                  setSelectedSpecializations(newValue);
                  setFieldValue('specialization', newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Medicine" placeholder="Select Medicine" />
                )}
              />
            </div>

             {/* Diagnostics */}
             <div>
              <Autocomplete
                multiple
                options={diagnostic}
                getOptionLabel={(option) => option.name}
                value={selectedDiagnostics}
                onChange={(event, newValue) => {
                  setSelectedDiagnostics(newValue);
                  setFieldValue('diagnostics', newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Diagnostics" placeholder="Select Diagnostics" />
                )}
              />
            </div>
          </div>

           

           

            {/* Note */}
            <div>
              <label className="mb-3 block text-sm font-medium text-black">Note</label>
              <Field
                name="note"
                placeholder="Enter Note"
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <ErrorMessage
                name="note"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

             {/* Description */}
             <div>
              <ReactQuill
                className="h-32 mt-5 mb-6"
                value={values.description}
                onChange={(value) => setFieldValue('description', value)}
                placeholder="Write a description..."
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>          

          {/* Submit Button */}
          <DialogActions>
            <button
              type="submit"
              className="w-full mt-5 inline-flex items-center justify-center rounded-md bg-black px-5 py-3 text-white hover:bg-opacity-90"
            >
              Add Patient
            </button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

export default ExistPatientForm;
