import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Grid,
    MenuItem,
    InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Apiservice } from '../../service/apiservice.ts';
import apiEndPoints from '../../constant/apiendpoints.ts';
import localStorageKeys from '../../constant/localStorageKeys.ts';
import toast from 'react-hot-toast';
import SearchIcon from '@mui/icons-material/Search';

interface ModalProps {
    handleToggelModal: () => void;
    handleClearRow: () => void;
    getAttendance: () => void;
    openModal: boolean;
    updateRow?: {
        _id: string,
        memberId: any, // can be member object (for edit) or string (for add)
        date: string,
        checkInTime: string,
        createdAt: string,
        updatedAt: string
    }
}

// Member type for dropdown (align with expected API structure for .fullName and .phone)
interface Member {
    _id: string;
    fullName: string;
    phone: string;
}

const AddAttendanceModal: React.FC<ModalProps> = ({
    handleToggelModal, openModal, updateRow, handleClearRow, getAttendance
}) => {
    // Find true memberId string value if updateRow is present and memberId is object
    const getInitialMemberId = () => {
        if (updateRow?.memberId && typeof updateRow.memberId === 'object' && updateRow.memberId._id) {
            return updateRow.memberId._id;
        }
        return typeof updateRow?.memberId === 'string' ? updateRow.memberId : '';
    };

    const [members, setMembers] = useState<Member[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch members based on search (name or phone)
    const fetchMembers = async (search: string) => {
        const token = localStorage.getItem(localStorageKeys.token);
        if (!token) return;
        setLoading(true);
        try {
            let url = `${apiEndPoints.member.get}?status=active`;
            if (search) url += `&search=${encodeURIComponent(search)}`;
            url += `&perPage=50`;
            const res = await Apiservice.getAuth(url, token);
            if (res && res.data.status === 200) {
                setMembers(res.data.data);
            } else {
                setMembers([]);
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Error loading members");
            setMembers([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchMembers('');
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchMembers(searchTerm);
        }, 400);

        return () => clearTimeout(timeout);
    }, [searchTerm]);

    // Default values: date is today, checkInTime is now
    const getDefaultDate = () => {
        const d = new Date();
        return d.toISOString().substring(0, 10);
    };
    const getDefaultTime = () => {
        const d = new Date();
        return d.toTimeString().substring(0, 5);
    };

    const handleSubmit = async (values: any, resetForm: any) => {

        console.log("valuesvaluesvaluesvaluesvaluesvalues" , values);
        
        try {
            const token = localStorage.getItem(localStorageKeys.token);
            if (!token) throw new Error("Token is missing.");
            let payload = { ...values };

            if (updateRow) {
                // Correct update API: apiEndPoints.attendance.update does not exist, so use create with attendanceId to allow backend to handle update
                payload.attendanceId = updateRow._id;

                var res = await Apiservice.postAuth(apiEndPoints.attendance.edit, payload, token);
                if (res && res.data.status === 200) {
                    toast.success("Attendance updated successfully");
                }
            } else {
                // Add attendance
                var res = await Apiservice.postAuth(apiEndPoints.attendance.create, payload, token);
                if (res && (res.data.status === 201 || res.data.status === 200)) {
                    toast.success("Attendance added successfully");
                }
            }
            resetForm();
            getAttendance();
            handleToggelModal();
            handleClearRow();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Submit failed");
            console.log(error);
        }
    };

    return (
        <Dialog open={openModal} fullWidth maxWidth="sm">
            <DialogTitle>
                {updateRow ? "Edit" : "Add"} Attendance
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
                        memberId: getInitialMemberId(),
                        date: updateRow?.date ? updateRow.date.substring(0, 10) : getDefaultDate(),
                        checkInTime: updateRow?.checkInTime || getDefaultTime(),
                    }}
                    onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
                >
                    {({ values, handleChange, handleBlur, setFieldValue }) => (
                        <Form>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Search Member by Name or Mobile"
                                        variant="outlined"
                                        fullWidth
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        placeholder="Search by name or mobile"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        label="Select Member"
                                        name="memberId"
                                        value={values.memberId}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                        required
                                        disabled={loading || !!updateRow}
                                        // Disable changing member in Edit mode
                                    >
                                        {members.length === 0 ? (
                                            <MenuItem value="" disabled>
                                                {loading ? "Loading..." : "No members found"}
                                            </MenuItem>
                                        ) : (
                                            members.map(member => (
                                                <MenuItem key={member._id} value={member._id}>
                                                    {member.fullName} ({member.phone})
                                                </MenuItem>
                                            ))
                                        )}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Date"
                                        name="date"
                                        type="date"
                                        value={values.date}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                        required
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Check In Time"
                                        name="checkInTime"
                                        type="time"
                                        value={values.checkInTime}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        fullWidth
                                        required
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <DialogActions sx={{ paddingInline: '20px' }}>
                                <button
                                    type="submit"
                                    className="flex w-full mt-5 mx-auto max-w-[350px] justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                                >
                                    {updateRow ? "Edit" : "Add"} Attendance
                                </button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default AddAttendanceModal;