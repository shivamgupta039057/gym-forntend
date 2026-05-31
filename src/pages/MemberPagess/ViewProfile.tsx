import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Typography,
  Avatar,
  Box,
  Divider,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

interface ModalProps {
  getFunction: () => void;
  setOpenAddModal: (open: boolean) => void;
  openModal: boolean;
  addPatientsId: any;
}

const ViewProfileModel: React.FC<ModalProps> = ({
  openModal,
  setOpenAddModal,
  getFunction,
  addPatientsId
}) => {

  if (!addPatientsId) {
    return null;
  }

  const profileFields = [
    { label: "Full Name", value: addPatientsId?.fullName },
    { label: "Phone", value: addPatientsId?.phone },
    { label: "Age", value: addPatientsId?.age },
    { label: "Gender", value: addPatientsId?.gender },
    { label: "Address", value: addPatientsId?.address },
    { label: "Join Date", value: addPatientsId?.joinDate ? new Date(addPatientsId?.joinDate).toLocaleDateString() : "" },
    { label: "Expiry Date", value: addPatientsId?.expiryDate ? new Date(addPatientsId?.expiryDate).toLocaleDateString() : "" },
    { label: "Plan", value: addPatientsId?.planId?.planName },
    { label: "Paid Fees", value: addPatientsId?.paidFees },
    { label: "Pending Fees", value: addPatientsId?.pendingFees },
    { label: "Weight", value: addPatientsId?.weight },
    { label: "Goal", value: addPatientsId?.goal },
    { label: "Status", value: addPatientsId?.status },
  ];

  return (
    <Dialog open={openModal} fullWidth maxWidth="sm">
      <DialogTitle>
        View Profile
        <IconButton
          onClick={() => setOpenAddModal(false)}
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={addPatientsId?.photo}
            alt={addPatientsId?.fullName}
            sx={{ width: 90, height: 90, mb: 1 }}
          />
          <Typography variant="h6">{addPatientsId?.fullName}</Typography>
          <Typography variant="body2" color="text.secondary">{addPatientsId?.phone}</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {profileFields.map((field, idx) => (
            <React.Fragment key={field.label}>
              <Grid item xs={5}>
                <Typography variant="subtitle2" color="textSecondary">
                  {field.label}
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography variant="body1">
                  {field.value === '' || typeof field.value === "undefined" || field.value === null ? <span style={{color: "#888"}}>N/A</span> : field.value}
                </Typography>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
        <Divider sx={{ my: 2 }}>Aadhaar</Divider>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
          {!!addPatientsId?.aadhaarFront && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" display="block" gutterBottom>
                Aadhaar Front
              </Typography>
              <img
                src={addPatientsId.aadhaarFront}
                alt="Aadhaar Front"
                style={{ width: 100, height: 'auto', borderRadius: 8, objectFit: "cover", border: "1px solid #eee" }}
              />
            </Box>
          )}
          {!!addPatientsId?.aadhaarBack && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" display="block" gutterBottom>
                Aadhaar Back
              </Typography>
              <img
                src={addPatientsId.aadhaarBack}
                alt="Aadhaar Back"
                style={{ width: 100, height: 'auto', borderRadius: 8, objectFit: "cover", border: "1px solid #eee" }}
              />
            </Box>
          )}
        </Box>
        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <Button variant="outlined" onClick={() => setOpenAddModal(false)}>Close</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProfileModel;