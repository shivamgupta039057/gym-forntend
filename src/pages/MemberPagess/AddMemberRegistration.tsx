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
  Avatar,
  Box,
  Typography,
  Stack,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState, useMemo } from 'react';
import { Formik, Form } from 'formik';
import { Apiservice } from '../../service/apiservice';
import apiEndPoints from '../../constant/apiendpoints';
import localStorageKeys from '../../constant/localStorageKeys';
import toast from 'react-hot-toast';

interface Plan {
  _id: string;
  planName: string;
  duration: number;
  price: number;
  [key: string]: any;
}

interface ModalProps {
  getFunction: () => void;
  setOpenAddModal: (open: boolean) => void;
  openModal: boolean;
  addPatientsId?: any;
}

interface AddMemberValues {
  fullName: string;
  phone: string;
  age: number | '';
  gender: string;
  address: string;
  planId: string;
  paidFees: number | '';
  weight: number | '';
  goal: string;
  photo: File | null;
  aadhaarPhoto: File | null;
}

const initialValues: AddMemberValues = {
  fullName: '',
  phone: '',
  age: '',
  gender: '',
  address: '',
  planId: '',
  paidFees: '',
  weight: '',
  goal: '',
  photo: null,
  aadhaarPhoto: null,
};

const validate = (values: AddMemberValues) => {
  const errors: Record<string, string> = {};
  if (!values.fullName) errors.fullName = 'Required';
  if (!values.phone) {
    errors.phone = 'Required';
  } else if (!/^\d{10}$/.test(values.phone)) {
    errors.phone = 'Phone must be 10 digits';
  }
  if (!values.age) errors.age = 'Required';
  if (!values.gender) errors.gender = 'Required';
  if (!values.address) errors.address = 'Required';
  if (!values.planId) errors.planId = 'Required';
  if (!values.paidFees) errors.paidFees = 'Required';
  if (!values.weight) errors.weight = 'Required';
  if (!values.goal) errors.goal = 'Required';
  if (!values.photo) errors.photo = 'Photo is required';
  if (!values.aadhaarPhoto) errors.aadhaarPhoto = 'Aadhaar Card Photo is required';
  return errors;
};

const AddMembersModal: React.FC<ModalProps> = ({
  openModal,
  setOpenAddModal,
  getFunction,
  addPatientsId
}) => {
  const token = localStorage.getItem(localStorageKeys.token);
  const [plans, setPlans] = useState<Plan[]>([]);

  // Photo preview states
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null);

  // For edit mode, prepare initialValues from addPatientsId if present.
  const getInitialValues = (): AddMemberValues => {
    if (
      addPatientsId &&
      typeof addPatientsId === 'object' &&
      Object.keys(addPatientsId).length > 0 &&
      addPatientsId._id
    ) {
      return {
        fullName: addPatientsId.fullName || '',
        phone: addPatientsId.phone || '',
        age: addPatientsId.age || '',
        gender: addPatientsId.gender || '',
        address: addPatientsId.address || '',
        planId: addPatientsId.planId && typeof addPatientsId.planId === 'object' ? addPatientsId.planId._id : addPatientsId.planId || '',
        paidFees: addPatientsId.paidFees || '',
        weight: addPatientsId.weight || '',
        goal: addPatientsId.goal || '',
        photo: null, // No File in edit
        aadhaarPhoto: null, // No File in edit
      };
    }
    return initialValues;
  };

  const formInitialValues = useMemo(getInitialValues, [addPatientsId]);

  const getPlans = async () => {
    try {
      if (!token) {
        throw new Error('Token is missing.');
      }
      let url = `${apiEndPoints.plan.get}`;
      const res = await Apiservice.getAuth(url, token);
      if (res && res.data.status == 200) {
        const newarr = res?.data?.data;
        setPlans(newarr);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPlans();
  }, []);

  useEffect(() => {
    // Reset preview (for closing modal or reinitialize)
    setPhotoPreview(null);
    setAadhaarPreview(null);
  }, [openModal, addPatientsId]);

  // ----------- Add/Edit Mode: API decision logic
  const handleSubmit = async (values: AddMemberValues, { resetForm }: any) => {
    try {
      if (!token) throw new Error('Token is missing.');

      const formData = new FormData();
      formData.append('fullName', values.fullName);
      formData.append('phone', values.phone);
      formData.append('age', values.age.toString());
      formData.append('gender', values.gender);
      formData.append('address', values.address);
      formData.append('planId', values.planId);
      formData.append('paidFees', values.paidFees.toString());
      formData.append('weight', values.weight.toString());
      formData.append('goal', values.goal);

      if (values.photo) {
        formData.append('photo', values.photo);
      }
      if (values.aadhaarPhoto) {
        formData.append('aadhaarFront', values.aadhaarPhoto);
      }

      let res;
      if (
        addPatientsId &&
        typeof addPatientsId === 'object' &&
        Object.keys(addPatientsId).length > 0 &&
        addPatientsId._id
      ) {
        // EDIT mode: call edit API
        formData.append('memberId', addPatientsId._id);
        res = await Apiservice.postAPIAuthFormData(`${apiEndPoints.member.update}`, formData, token);
      } else {
        // ADD mode: call add API
        res = await Apiservice.postAPIAuthFormData(apiEndPoints.member.create, formData, token);
      }

      if (
        (res?.status === 201 || res?.data?.status === 200) &&
        res.data &&
        res.data.message
      ) {
        toast.success(res.data?.message);
        resetForm();
        setOpenAddModal(false);
        getFunction();
      } else if (res?.data?.message) {
        toast.success(res.data?.message);
        setOpenAddModal(false);
        getFunction();
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong.');
    }
  };

  const dialogTitle = addPatientsId && addPatientsId._id ? 'Edit Member' : 'Add Member';
  const submitButtonLabel = addPatientsId && addPatientsId._id ? 'Update Member' : 'Add Member';

  return (
    <Dialog open={openModal} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 600, fontSize: 22 }}>
        {dialogTitle}
        <IconButton
          onClick={() => {
            setOpenAddModal(false);
          }}
          aria-label="close"
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon fontSize="medium" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Formik
          enableReinitialize
          initialValues={formInitialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue, touched, errors }) => (
            <Form encType="multipart/form-data">
              <Grid container spacing={3} sx={{ py: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    value={values.fullName}
                    onChange={e => setFieldValue('fullName', e.target.value)}
                    error={touched.fullName && Boolean(errors.fullName)}
                    helperText={touched.fullName && errors.fullName ? errors.fullName : ''}
                    fullWidth
                    size="medium"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    value={values.phone}
                    onChange={e => setFieldValue('phone', e.target.value)}
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone ? errors.phone : ''}
                    fullWidth
                    size="medium"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Age"
                    name="age"
                    type="number"
                    value={values.age}
                    onChange={e => setFieldValue('age', e.target.value)}
                    error={touched.age && Boolean(errors.age)}
                    helperText={touched.age && errors.age ? errors.age : ''}
                    fullWidth
                    size="medium"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl
                    fullWidth
                    error={touched.gender && Boolean(errors.gender)}
                  >
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      id="gender"
                      name="gender"
                      value={values.gender}
                      label="Gender"
                      onChange={e => setFieldValue('gender', e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Select gender</em>
                      </MenuItem>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                    <FormHelperText>
                      {touched.gender && errors.gender ? errors.gender : ''}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Weight"
                    name="weight"
                    type="number"
                    value={values.weight}
                    onChange={e => setFieldValue('weight', e.target.value)}
                    error={touched.weight && Boolean(errors.weight)}
                    helperText={touched.weight && errors.weight ? errors.weight : ''}
                    fullWidth
                    size="medium"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    error={touched.planId && Boolean(errors.planId)}
                  >
                    <InputLabel id="plan-label">Plan</InputLabel>
                    <Select
                      labelId="plan-label"
                      id="planId"
                      name="planId"
                      value={values.planId}
                      label="Plan"
                      onChange={e => setFieldValue('planId', e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Select plan</em>
                      </MenuItem>
                      {Array.isArray(plans) && plans.length > 0 && plans.map(plan => (
                        <MenuItem key={plan._id} value={plan._id}>
                          {plan.planName} - {plan.duration} {plan.duration > 1 ? "months" : "month"} - ₹{plan.price}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {touched.planId && errors.planId ? errors.planId : ''}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Paid Fees"
                    name="paidFees"
                    type="number"
                    value={values.paidFees}
                    onChange={e => setFieldValue('paidFees', e.target.value)}
                    error={touched.paidFees && Boolean(errors.paidFees)}
                    helperText={touched.paidFees && errors.paidFees ? errors.paidFees : ''}
                    fullWidth
                    size="medium"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Address"
                    name="address"
                    value={values.address}
                    onChange={e => setFieldValue('address', e.target.value)}
                    multiline
                    minRows={2}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address ? errors.address : ''}
                    fullWidth
                    size="medium"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Goal"
                    name="goal"
                    value={values.goal}
                    onChange={e => setFieldValue('goal', e.target.value)}
                    multiline
                    minRows={2}
                    error={touched.goal && Boolean(errors.goal)}
                    helperText={touched.goal && errors.goal ? errors.goal : ''}
                    fullWidth
                    size="medium"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                      Member Photo
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Avatar
                        src={photoPreview ? photoPreview : (addPatientsId && addPatientsId.photoUrl ? addPatientsId.photoUrl : undefined)}
                        sx={{ width: 90, height: 90, bgcolor: '#eee' }}
                        variant="rounded"
                      />
                    </Box>
                    <Button
                      component="label"
                      variant="contained"
                      color={values.photo ? "success" : "primary"}
                      size="small"
                      sx={{ textTransform: 'none', mb: 1 }}
                      fullWidth
                    >
                      {values.photo ? "Change Photo" : "Upload Photo"}
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={e => {
                          if (e.currentTarget.files && e.currentTarget.files.length > 0) {
                            const file = e.currentTarget.files[0];
                            setFieldValue('photo', file);
                            const reader = new FileReader();
                            reader.onloadend = () => setPhotoPreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </Button>
                    <Typography variant="body2" sx={{ minHeight: 22 }}>
                      {values.photo ? values.photo.name : addPatientsId && addPatientsId.photoUrl ? "Existing photo loaded" : ''}
                    </Typography>
                    {touched.photo && errors.photo && (
                      <FormHelperText error>{errors.photo}</FormHelperText>
                    )}
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                      Aadhaar Card Photo
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Avatar
                        src={aadhaarPreview ? aadhaarPreview : (addPatientsId && addPatientsId.aadhaarPhotoUrl ? addPatientsId.aadhaarPhotoUrl : undefined)}
                        sx={{ width: 90, height: 90, bgcolor: '#eee' }}
                        variant="rounded"
                      />
                    </Box>
                    <Button
                      component="label"
                      variant="contained"
                      color={values.aadhaarPhoto ? "success" : "primary"}
                      size="small"
                      sx={{ textTransform: 'none', mb: 1 }}
                      fullWidth
                    >
                      {values.aadhaarPhoto ? "Change Aadhaar Photo" : "Upload Aadhaar Card"}
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={e => {
                          if (e.currentTarget.files && e.currentTarget.files.length > 0) {
                            const file = e.currentTarget.files[0];
                            setFieldValue('aadhaarPhoto', file);
                            const reader = new FileReader();
                            reader.onloadend = () => setAadhaarPreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </Button>
                    <Typography variant="body2" sx={{ minHeight: 22 }}>
                      {values.aadhaarPhoto ? values.aadhaarPhoto.name : addPatientsId && addPatientsId.aadhaarPhotoUrl ? "Existing Aadhaar photo loaded" : ''}
                    </Typography>
                    {touched.aadhaarPhoto && errors.aadhaarPhoto && (
                      <FormHelperText error>{errors.aadhaarPhoto}</FormHelperText>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                      onClick={() => setOpenAddModal(false)}
                      disabled={isSubmitting}
                      variant="outlined"
                      color="secondary"
                      sx={{ minWidth: 120, fontWeight: 500 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      sx={{ minWidth: 160, fontWeight: 500 }}
                    >
                      {isSubmitting ? "Submitting..." : submitButtonLabel}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersModal;
