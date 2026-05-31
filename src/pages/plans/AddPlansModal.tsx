import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';
import { Formik, Form } from 'formik';
import { Apiservice } from '../../service/apiservice.ts';
import apiEndPoints from '../../constant/apiendpoints.ts';
import localStorageKeys from '../../constant/localStorageKeys.ts';
import toast from 'react-hot-toast';

// Modal props for plan CRUD
interface ModalProps {
    handleToggelModal: () => void;
    handleClearRow: () => void;
    getPlans: () => void;
    openModal: boolean;
    updateRow: {
        _id: string,
        planName: string,
        duration: number,
        price: number,
        description: string,
        createdAt: string,
        updatedAt: string
    } | undefined
}

const AddPlansModal: React.FC<ModalProps> = ({
    handleToggelModal, openModal, updateRow, handleClearRow, getPlans
}) => {

    console.log("updateRowupdateRowupdateRow" , updateRow);
    

    const handleSubmit = async (values: any, resetForm: any) => {

        console.log("valuesvaluesvaluesvalues" , values);
        
        try {
            const token = localStorage.getItem(localStorageKeys.token);
            if (!token) throw new Error("Token is missing.");
            if (updateRow) {
                // Edit plan
                const payload = {
                    planId : updateRow._id,
                    ...values

                }
                const res = await Apiservice.postAuth(
                    `${apiEndPoints.plan.update}`,
                    payload,
                    token
                );
                if (res && res.data.status == 200) {
                    toast.success("Plan edited successfully");
                    resetForm();
                    getPlans();
                    handleToggelModal();
                    handleClearRow();
                }
            } else {
                // Add plan
                const res = await Apiservice.postAuth(apiEndPoints.plan.create, values, token);
                if (res && res.data.status === 201) {
                    toast.success("Plan added successfully");
                    resetForm();
                    getPlans();
                    handleToggelModal();
                    handleClearRow();
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Dialog open={openModal} fullWidth maxWidth="sm">
            <DialogTitle>
                {updateRow ? "Edit" : "Add"} Plan
            </DialogTitle>
            <IconButton
                onClick={() => {
                    handleToggelModal();
                    handleClearRow();
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

            <DialogContent>
                <Formik
                    enableReinitialize
                    initialValues={{
                        planName: updateRow ? updateRow.planName : '',
                        duration: updateRow ? updateRow.duration : '',
                        price: updateRow ? updateRow.price : '',
                        description: updateRow ? updateRow.description : '',
                    }}
                    // For brevity, not wiring up validationSchema here. Plug your own if needed.
                    onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
                >
                    {({ values, handleChange, handleBlur }) => (
                        <Form>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Plan Name"
                                        name="planName"
                                        value={values.planName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Duration (months)"
                                        name="duration"
                                        type="number"
                                        value={values.duration}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Price"
                                        name="price"
                                        type="number"
                                        value={values.price}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                        multiline
                                        minRows={2}
                                    />
                                </Grid>
                            </Grid>
                            <DialogActions sx={{ paddingInline: '20px' }}>
                                <button
                                    type="submit"
                                    className="flex w-full mt-5 mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                                >
                                    {updateRow ? "Edit" : "Add"} Plan
                                </button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default AddPlansModal;