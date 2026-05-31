import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
// import { useFormikContext } from 'formik';
import { NotExistPatientSchema } from './schema/NotExistPatientSchema';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DialogActions from '@mui/material/DialogActions';
// import { useFormikContext } from 'formik';

interface AddPatientFormProps {
  handleSubmit: (values: any) => void;
  specializationList: Array<{ medicineName: string; _id: string }>;
  diagnostic: Array<{
    _id: string;
    diagnosticName: string;
    diagnosticImages: string;
    createdAt: string;
    updatedAt: string;
  }>;
  PatientsId: {
    _id: string;
    username: string;
    mobileNo: string;
    relationship: string;
    sex: string;
    age: number;
    address: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  newUserData: {
    mobileNo: string;
    relationship: string;
  };
  updateRow: {
    _id: string;
    ticketDate: string;
    medicineName: string[];
    DiagnosticName: string[];
    amount: number;
    note: string;
    ticketDescription: string;
    username: string;
    mobileNo: string;
    sex: string;
    age: number;
    address: string;
  };
}

interface FormValues {
  diagnostics: Diagnostic[];
  specialization: Specialization[];
}

const relationshipOptions = [
  { label: 'Self', value: 'self' },
  { label: 'Mother', value: 'mother' },
  { label: 'Father', value: 'father' },
  { label: 'Son', value: 'son' },
  { label: 'Daughter', value: 'daughter' },
  { label: 'Wife', value: 'wife' },
];
interface Diagnostic {
  diagnosticName: string;
}

interface Specialization {
  medicineName: string;
}

const NotExistPatientForm: React.FC<AddPatientFormProps> = ({
  handleSubmit,
  specializationList,
  diagnostic,
  PatientsId,
  newUserData,
  updateRow,
}) => {
  const formik = useFormikContext<FormValues>();
  console.log('updateRowformik', updateRow);
  

  const initialValues = React.useMemo(
    () => ({
      NameOfPatient: PatientsId?.username || updateRow?.username || '',
      mobile:
        PatientsId?.mobileNo ||
        newUserData?.mobileNo ||
        updateRow?.mobileNo ||
        '',
      patientDate: updateRow?.ticketDate || '',
      specialization: [],
      address: PatientsId?.address || updateRow?.address || '',
      gender: PatientsId?.sex || updateRow?.sex || '',
      age: PatientsId?.age || updateRow?.age || '',
      description: updateRow?.ticketDescription || '',
      amount: updateRow?.amount || '',
      note: updateRow?.note || '',
      relationship:
        PatientsId?.relationship ||
        updateRow?.relationship ||
        newUserData?.relationship ||
        '',
      diagnostics: [],
      doses: updateRow?.doses || '',
      timing : updateRow?.doesTiming || "",
      finalDiagnostics: updateRow?.finalDiagnostics || '',
      medicineDoesDays : updateRow?.medicineDoesDays || "" ,
      outsideMedicineName : updateRow?.outsideMedicineName || "" ,


    }),
    [PatientsId, updateRow, newUserData],
  );

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={NotExistPatientSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values }) => {
        console.log('values', values);

        useEffect(() => {
          if (updateRow?.DiagnosticName && setFieldValue) {
            const matchedItems = updateRow.DiagnosticName.map((name) =>
              diagnostic.find((item) => item.diagnosticName === name),
            ).filter(Boolean);
            setFieldValue('diagnostics', matchedItems as Diagnostic[]);
          }
        }, [updateRow?.DiagnosticName, diagnostic, formik]);

        useEffect(() => {
          if (updateRow?.medicineName && setFieldValue) {
            const matchedItems = updateRow.medicineName
              .map((name) =>
                specializationList.find((item) => item.medicineName === name),
              )
              .filter(Boolean);
            //  console.log("matchedItems" , matchedItems);

            setFieldValue('specialization', matchedItems as Specialization[]);
          }
        }, [updateRow?.medicineName, specializationList, formik]);

        return (
          <>
            <Form>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name Of Patient */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black">
                    Name Of Patient
                  </label>
                  <Field
                    name="NameOfPatient"
                    placeholder="Name Of Patient"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage
                    name="NameOfPatient"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black">
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
                    className="text-red-500 text-sm"
                  />
                </div>
                {/*  */}

                <div>
                  <label className="mb-3 block text-sm font-medium text-black">
                    Select Relationship
                  </label>
                  <Autocomplete
                    value={
                      relationshipOptions.find(
                        (option) => option.value === values.relationship,
                      ) || null
                    }
                    options={relationshipOptions}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, newValue) =>
                      setFieldValue(
                        'relationship',
                        newValue ? newValue.value : '',
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Relationship"
                        variant="outlined"
                        error={
                          !!values.relationship && !values.relationship.trim()
                        }
                        helperText={
                          <ErrorMessage
                            name="relationship"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        }
                      />
                    )}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black">
                    Gender
                  </label>
                  <Field
                    as="select"
                    name="gender"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

              

                {/* Address */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black">
                    Address
                  </label>
                  <Field
                    name="address"
                    placeholder="Enter Address"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black">
                    Age
                  </label>
                  <Field
                    name="age"
                    placeholder="Enter Age"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage
                    name="age"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {/* clent problem */}

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
                {/* clent problem */}

                <div>
                  <label className="mb-3 block text-sm font-medium text-black">
                  Patient Complaint
                  </label>
                  <Field
                    name="note"
                    placeholder="Enter Client Problem"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage
                    name="note"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                {/*  */}

                {/* Specialization */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black">
                    Select Medicine
                  </label>
                  <Autocomplete
                    multiple
                    options={specializationList}
                    getOptionLabel={(option) => option.medicineName}
                    // value={selectedSpecializations}
                    value={values.specialization}
                    onChange={(event, newValue) => {
                      setFieldValue('specialization', newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="Select Medicine"
                        placeholder="Select Medicine"
                      />
                    )}
                  />
                </div>

                {/*  */}
                {/*  */}

                {/* Diagnostics */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black">
                    Select Diagnostics
                  </label>
                  <Autocomplete
                    multiple
                    options={diagnostic}
                    getOptionLabel={(option) => option.diagnosticName}
                    value={values.diagnostics}
                    onChange={(event, newValue) => {
                      // setSelectedDiagnostics(newValue);
                      setFieldValue('diagnostics', newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // label="Select Diagnostics"
                        placeholder="Select Diagnostics"
                      />
                    )}
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black">
                    Amount
                  </label>
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

                {/* Note */}
              

                {/* finalDiagnostics */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-black">
                    Final Diagnostics
                  </label>
                  <Field
                    name="finalDiagnostics"
                    placeholder="Final Diagnostics"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage
                    name="finalDiagnostics"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* start medician does */}

                <div>
                  <label className="mb-3 block text-sm font-medium text-black">
                    Medicine Does Days
                  </label>
                  <Field
                    name="medicineDoesDays"
                    placeholder="Final Diagnostics"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage
                    name="medicineDoesDays"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                  <div>
                  <label className="mb-3 block text-sm font-medium text-black">
                    Outside Medicine Name
                  </label>
                  <Field
                    name="outsideMedicineName"
                    placeholder="Outside Medicine"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <ErrorMessage
                    name="outsideMedicineName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* medicine dose  */}

                {/* Description */}
              </div>
              
              <div>
                {values.specialization.map((item) => (
                  <div
                    key={item.medicineName}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
                  >
                    <div>
                      <label className="mb-3 block text-sm font-medium text-black">
                        {item.medicineName.charAt(0).toUpperCase() +
                          item.medicineName.slice(1)}{' '}
                        Doses
                      </label>
                      <TextField
                        name={`doses.${item.medicineName}`}
                        placeholder={`${item.medicineName} doses`}
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={values?.doses?.[item?.medicineName] || ''}
                        onChange={(e) =>
                          setFieldValue(
                            `doses.${item.medicineName}`,
                            e.target.value,
                          )
                        }
                      />
                      <ErrorMessage
                        name={`doses.${item.medicineName}`}
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-3 block text-sm font-medium text-black">
                        Select Times
                      </label>
                      <FormGroup row>
                        {['Morning', 'Afternoon', 'Evening', 'Night'].map(
                          (time) => (
                            <FormControlLabel
                              key={time}
                              control={
                                <Checkbox
                                  name={`timing.${item.medicineName}`}
                                  value={time}
                                  checked={
                                    values?.timing?.[
                                      item.medicineName
                                    ]?.includes(time) || false
                                  }
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    const currentTiming =
                                      values?.timing?.[item.medicineName] || [];
                                    setFieldValue(
                                      `timing.${item.medicineName}`,
                                      checked
                                        ? [...currentTiming, time]
                                        : currentTiming.filter(
                                            (t) => t !== time,
                                          ),
                                    );
                                  }}
                                  size="small"
                                  color="primary"
                                />
                              }
                              label={time}
                            />
                          ),
                        )}
                      </FormGroup>
                      <ErrorMessage
                        name={`timing.${item.medicineName}`}
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <ReactQuill
                  className="h-32 mt-4 mb-6"
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
          </>
        );
      }}
    </Formik>
  );
};

export default NotExistPatientForm;
