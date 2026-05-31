import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { Formik, Form } from 'formik';
import { Apiservice } from '../../service/apiservice';
import apiEndPoints from '../../constant/apiendpoints';
import localStorageKeys from '../../constant/localStorageKeys';
import toast from 'react-hot-toast';

interface ModalProps {
  getFunction: () => void;
  setOpenAddModal: (open: boolean) => void;
  openModal: boolean;
  addPatientsId: any;
}

interface StatusValues {
  status: string;
}

const statusOptions = [
  { key: 'active', label: 'Active', value: 'active' },
  { key: 'expired', label: 'Expired', value: 'expired' },
  { key: 'left', label: 'Left', value: 'left' },
];

const initialValues: StatusValues = {
  status: '',
};

const validate = (values: StatusValues) => {
  const errors: Record<string, string> = {};
  if (!values.status) errors.status = 'Required';
  return errors;
};

const ChangeStatusModel: React.FC<ModalProps> = ({
  openModal,
  setOpenAddModal,
  getFunction,
  addPatientsId,
}) => {
  const token = localStorage.getItem(localStorageKeys.token);

  const handleSubmit = async (values: StatusValues, { resetForm }: any) => {
    try {
      if (!token) {
        throw new Error('Token is missing.');
      }

      const payload = {
        memberId: addPatientsId?._id,
        status: values.status,
      };

      const res = await Apiservice.postAuth(apiEndPoints.member.change_status, payload, token);

      if (res?.status === 200 || res?.data?.status === 200) {
        toast.success(res.data?.message || "Status Changed successful");
        resetForm();
        setOpenAddModal(false);
        getFunction();
      } else {
        toast.error(res?.data?.message || "Failed to change status.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <Dialog open={openModal} fullWidth maxWidth="sm">
      <DialogTitle>
        Change Status
        <IconButton
          onClick={() => {
            setOpenAddModal(false);
          }}
          aria-label="close"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue, touched, errors }) => (
            <Form>
              <Grid container spacing={2} sx={{ py: 2 }}>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    margin="dense"
                    error={touched.status && Boolean(errors.status)}
                  >
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      id="status"
                      name="status"
                      value={values.status}
                      label="Status"
                      onChange={e => setFieldValue('status', e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Select status</em>
                      </MenuItem>
                      {statusOptions.map((option) => (
                        <MenuItem key={option.key} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {touched.status && errors.status ? errors.status : ''}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <DialogActions>
                    <Button
                      onClick={() => setOpenAddModal(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Change Status
                    </Button>
                  </DialogActions>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeStatusModel;