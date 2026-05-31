import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { DefaultValidationSchema } from './schema/DefaultPatientsSchema.tsx';
import { Autocomplete, TextField } from '@mui/material';

const relationshipOptions = [
  { label: 'Self', value: 'self' },
  { label: 'Mother', value: 'mother' },
  { label: 'Father', value: 'father' },
  { label: 'Son', value: 'son' },
  { label: 'Daughter', value: 'daughter' },
  { label: 'Wife', value: 'wife' },
];

interface DefaultPatientsProps {
  handleSubmitMobile: (values: { mobile: string }, formikHelpers: any) => void;
}

const DefaultPatients: React.FC<DefaultPatientsProps> = ({ handleSubmitMobile }) => {
  return (
    <div>
      <Formik
        initialValues={{
          mobile: '',
          relationship: '',
        }}
        validationSchema={DefaultValidationSchema}
        onSubmit={handleSubmitMobile}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mobile Number Input */}
              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Patient Mobile No.
                </label>
                <Field
                  name="mobile"
                  placeholder="Patient Mobile No."
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <ErrorMessage
                  name="mobile"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Patient Relationship
              </label>
              <Autocomplete
                options={relationshipOptions}
                getOptionLabel={(option) => option.label}
                onChange={(event, newValue) =>
                  setFieldValue('relationship', newValue ? newValue.value : '')
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Relationship"
                    variant="outlined"
                    error={!!values.relationship && !values.relationship.trim()}
                    helperText={
                      <ErrorMessage name="relationship" component="div" className="text-red-500 text-sm" />
                    }
                  />
                )}
                className="w-full"
              />
            </div>
              {/*  */}
              {/* add select here  */}
              {/*  */}
            </div>

            {/* Submit Button */}
            <div className="mt-4">
              <button
                type="submit"
                className="w-full mx-auto max-w-xs inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Patient'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DefaultPatients;
