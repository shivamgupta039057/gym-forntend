import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js'
import { Apiservice } from '../../service/apiservice.js';
import apiEndPoints from '../../constant/apiendpoints.js';
import localStorageKeys from '../../constant/localStorageKeys.js';
import { MaterialReactTable, MRT_SortingState } from 'material-react-table';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton, MenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base';
import { MenuItem, TextField, Select, InputLabel, FormControl } from '@mui/material';
import { Route, useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { ROUTES_CONST } from '../../constant/routeConstant.js';
import AddMembersModal from './AddMemberRegistration.js';
import AddRenewModel from './AddRenewModel.js';

// Remove moment import, use custom date formatter below

const Listbox = styled('ul')(
  () => `
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 12px;
    margin: 12px 0;
    min-width: 150px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background : #fff;
    border: 1px solid #DAE2ED;
    color: #1C2025;
    box-shadow: 0px 4px 6px 'rgba(0,0,0, 0.05)';
    z-index: 1;
    `,
);

const MenuItemStyled = styled(BaseMenuItem)(
  () => `
    list-style: none;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;

    &:last-of-type {
      border-bottom: none;
    }

    &:focus {
      outline: 3px solid #99CCF3;
      background-color: #E5EAF2;
      color: #1C2025;
    }

    &.${menuItemClasses.disabled} {
      color: #B0B8C4;
    }
    `,
);

const MenuButtonStyled = styled(BaseMenuButton)(
  () => `
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 3px 6px;
    border-radius: 8px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    color: #B0B8C4;

    &:hover {
      background: #F3F6F9;
      border-color: #C7D0DD;
    }

    &:active {
      background: #E5EAF2;
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px #99CCF3;
      outline: none;
    }
    `,
);

// --- custom date formatter in place of moment ---
function formatDate(dateValue: string | Date | undefined | null): string {
  if (!dateValue) return 'N/A';
  let dateObj: Date;
  if (typeof dateValue === 'string') {
    dateObj = new Date(dateValue);
  } else {
    dateObj = dateValue;
  }
  if (isNaN(dateObj.getTime())) return 'N/A';
  // Format: 'DD/MM/YYYY'
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
}

const MemberPaymentHistory: React.FC = () => {
  const [patient, setPatient] = useState([])
  const [PaymentHistory, setPaymentHistory] = useState({})
  
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [searchTerms, setSearchTerm] = useState<string>("")
  const [addPatientsId, setAddPatientsId] = useState<string>("")
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [AddOpenModal , setAddOpenModal] = useState<boolean>(false);
  const [AddRenewOpenModal , setAddRenewOpenModal] = useState<boolean>(false);
   const { memberId } = useParams();
  


  // -- Filters retained only for filtering by name, plan, pending fees, expiry
  const [filterName, setFilterName] = useState<string>("")
  const [planIds, setPlanIds] = useState<Array<{_id:string, planName:string}>>([])
  const [planId, setPlanId] = useState<string>("")
  const [pendingFees, setPendingFees] = useState<string>("")
  const [expiringSoon, setExpiringSoon] = useState<string>("")

  const token = localStorage.getItem(localStorageKeys.token);
  const navigate = useNavigate();

  console.log("🚀 ~ file: PaymentHistory.tsx:35 ~ MemberPaymentHistory ~ memberId:", memberId)

  useEffect(() => {
    const getPlans = async () => {
      try {
        if (!token) return;
        const res = await Apiservice.getAuth(apiEndPoints.plan.get, token);
        if (res && res.data.status === 200) {
          setPlanIds(res.data.data || []);
        }
      } catch (err) {
        setPlanIds([]);
      }
    };
    getPlans();
  }, [token]);

  // Only show the following columns (fields):
  // "fullName", "phone", "age", "gender", "address", "joinDate", "expiryDate", "planId.planName", "paidFees", "pendingFees", "weight", "goal", "status"
  const columns = [
    {
      header: 'ID',
      accessorKey: "SrNo",
      size: 70,
      Cell: ({ row }) =>
        row.index + 1 + pageState.pageIndex * pageState.pageSize,
      enableColumnActions: false,
      enableSorting: false,
    },
    {
      header: 'Full Name',
      accessorKey: 'memberId.fullName',
      enableSorting: true,
      size: 160,
      Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      enableSorting: true,
      size: 140,
      Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      header: 'Payment Date',
      accessorKey: 'paymentDate',
      enableSorting: true,
      size: 60,
      Cell: ({ cell }: { cell: any }) => {
        const val = cell.getValue();
        // Use custom formatDate (no moment)
        // Format: 'DD/MM/YYYY'
        return formatDate(val);
      },
    },
    {
      header: 'Payment Method',
      accessorKey: 'paymentMethod',
      enableSorting: true,
      size: 100,
      Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      header: 'note',
      accessorKey: 'note',
      enableSorting: true,
      size: 200,
      Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      header: 'Actions',
      accessorKey: '_id',
      size: 120,
      enableSorting: false,
      Cell: ({ cell, row }: any) => {
        const id = cell.getValue();
        const memberObj = row.original;
        return id ? (
          <Dropdown>
            <MenuButtonStyled aria-label="More actions">
              <MoreHorizIcon />
            </MenuButtonStyled>
            <Menu slots={{ listbox: Listbox }} className="z-99999">
              <MenuItemStyled
                onClick={() => navigate(`${ROUTES_CONST.INVOICE_VIEW}/${memberObj._id}`)}
              >
                View Invoice
              </MenuItemStyled>
            
            </Menu>
          </Dropdown>
        ) : 'N/A';
      },
    },
    
  ];

  // Use useEffect to watch for filter change and get table data from API
  const getPaymentHistory = async () => {
    try {
      if (!token) {
        throw new Error("Token is missing.")
      }
      
      const res = await Apiservice.getAuth(`${apiEndPoints.member.payment_history}/${memberId}`, token);


      console.log("resresresresresresresres" , res);
      

      if (res && res.data.status === 200) {
        setPatient(res.data.data);
        setPaymentHistory({
          totalPaidAmount  : res.data.totalPaidAmount,
          totalPayments : res.data.totalPayments
        })
        setTotalPages(res?.data?.pagination?.totalItems);
      }
    } catch (error: any) {
      setPatient([]);
      toast.error(error?.response?.data?.message || "Error fetching members");
    }
  }

  const handleDelete = async (id: string | null) => {
    try {
      if (!token) {
        throw new Error("Token is missing.")
      }
      const body = {
        id: id
      }
      const res = await Apiservice.postAuth(apiEndPoints.patient.delete, body, token);      
      if (res && res.data.status === 200) {
        toast.success(res.data.message)
        getPaymentHistory()
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getPaymentHistory();
    // eslint-disable-next-line
  }, [memberId]);

  const AddDoctorModal = () => {
    setAddOpenModal(prev => !prev);
  }

  // Handlers for dropdown filter changes
  const handlePlanChange = (e: any) => {
    setPlanId(e.target.value);
    setPageState({ ...pageState, pageIndex: 0 });
  }
  const handlePendingFeesChange = (e: any) => {
    setPendingFees(e.target.value);
    setPageState({ ...pageState, pageIndex: 0 });
  }
  const handleExpiringSoonChange = (e: any) => {
    setExpiringSoon(e.target.value);
    setPageState({ ...pageState, pageIndex: 0 });
  }
  const handleFilterName = (e: any) => {
    setFilterName(e.target.value);
    setPageState({ ...pageState, pageIndex: 0 });
  }


  console.log("patientpatientpatientpatient" , PaymentHistory);
  

  return (
    <>
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Payment History" />
      
      </div>


      <div style={{ display: 'flex', gap: '32px', marginBottom: '32px' }}>
        <div
          style={{
            minWidth: '200px',
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '24px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#444' }}>
            Total Paid Amount
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px', color: '#2196f3' }}>
            ₹{PaymentHistory?.totalPaidAmount}
          </div>
        </div>
        <div
          style={{
            minWidth: '200px',
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '24px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#444' }}>
            Total Payments
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px', color: '#43a047' }}>
            {PaymentHistory?.totalPayments}
          </div>
        </div>
      </div>
 




      <div className="table-container capitalize">
        <MaterialReactTable
          columns={columns}
          data={patient}
          manualPagination
          manualSorting
          paginationDisplayMode={'pages'}
          rowCount={totalPages}
          onSortingChange={setSorting}
          manualFiltering={true}
          enableColumnFilters={false}
          enableColumnActions={false}
          onGlobalFilterChange={setSearchTerm}
          muiPaginationProps={{
            color: 'primary',
            shape: 'rounded',
            showRowsPerPage: false,
            variant: 'outlined',
          }}
          state={{
            pagination: pageState,
            sorting: sorting
          }}
          onPaginationChange={(state) => {
            setPageState(state);
          }}
        />
      </div>
      <AddMembersModal
        openModal={AddOpenModal}
        setOpenAddModal={setAddOpenModal}
        getFunction={getPaymentHistory}
        addPatientsId={addPatientsId}
      />

<AddRenewModel
        openModal={AddRenewOpenModal}
        setOpenAddModal={setAddRenewOpenModal}
        getFunction={getPaymentHistory}
        addPatientsId={addPatientsId}
      />
    </>
  )
}

export default MemberPaymentHistory;
