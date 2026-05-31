import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
  MenuItem,
  TextField,
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

interface RenewValues {
  paidAmount: string;
  paymentMethod: string;
}

const paymentMethods = [
  { key: 'cash', label: 'Cash', value: 'cash' },
  { key: 'card', label: 'Card', value: 'card' },
  { key: 'upi', label: 'UPI', value: 'upi' },
];

const initialValues: RenewValues = {
  paidAmount: '',
  paymentMethod: '',
};

const validate = (values: RenewValues) => {
  const errors: Record<string, string> = {};
  if (!values.paidAmount) errors.paidAmount = 'Required';
  if (!values.paymentMethod) errors.paymentMethod = 'Required';
  return errors;
};

const AddRenewModel: React.FC<ModalProps> = ({
  openModal,
  setOpenAddModal,
  getFunction,
  addPatientsId
}) => {

  const token = localStorage.getItem(localStorageKeys.token);

  const handleSubmit = async (values: RenewValues, { resetForm }: any) => {
    try {
      if (!token) {
        throw new Error('Token is missing.');
      }

      const payload = {
        memberId : addPatientsId?._id,
        paidAmount: values.paidAmount,
        paymentMethod: values.paymentMethod,
      };

      // You can update this API endpoint if there's a separate renew endpoint
      const res = await Apiservice.postAuth(apiEndPoints.member.renew, payload, token);

      if (res?.status === 201 || res?.data?.status === 200) {
        toast.success(res.data?.message || "Renewal successful");
        resetForm();
        setOpenAddModal(false);
        getFunction();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <Dialog open={openModal} fullWidth maxWidth="sm">
      <DialogTitle>
        Add Renew Model
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
                  <TextField
                    label="Paid Amount"
                    name="paidAmount"
                    type="number"
                    value={values.paidAmount}
                    onChange={e => setFieldValue('paidAmount', e.target.value)}
                    error={touched.paidAmount && Boolean(errors.paidAmount)}
                    helperText={touched.paidAmount && errors.paidAmount ? errors.paidAmount : ''}
                    fullWidth
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    margin="dense"
                    error={touched.paymentMethod && Boolean(errors.paymentMethod)}
                  >
                    <InputLabel id="payment-method-label">Payment Method</InputLabel>
                    <Select
                      labelId="payment-method-label"
                      id="paymentMethod"
                      name="paymentMethod"
                      value={values.paymentMethod}
                      label="Payment Method"
                      onChange={e => setFieldValue('paymentMethod', e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Select payment method</em>
                      </MenuItem>
                      {paymentMethods.map((method) => (
                        <MenuItem key={method.key} value={method.value}>
                          {method.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {touched.paymentMethod && errors.paymentMethod ? errors.paymentMethod : ''}
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
                      Renew
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

export default AddRenewModel;