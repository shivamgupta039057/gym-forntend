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
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { ROUTES_CONST } from '../../constant/routeConstant.js';
import AddMembersModal from './AddMemberRegistration.js';
import AddRenewModel from './AddRenewModel.js';

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

const ExpiredMembers: React.FC = () => {
  const [patient, setPatient] = useState([])
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [searchTerms, setSearchTerm] = useState<string>("")
  const [addPatientsId, setAddPatientsId] = useState<string>("")
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [AddOpenModal , setAddOpenModal] = useState<boolean>(false);
  const [AddRenewOpenModal , setAddRenewOpenModal] = useState<boolean>(false);


  // -- Filters retained only for filtering by name, plan, pending fees, expiry
  const [filterName, setFilterName] = useState<string>("")
  const [planIds, setPlanIds] = useState<Array<{_id:string, planName:string}>>([])
  const [planId, setPlanId] = useState<string>("")
  const [pendingFees, setPendingFees] = useState<string>("")
  const [expiringSoon, setExpiringSoon] = useState<string>("")

  const token = localStorage.getItem(localStorageKeys.token);
  const navigate = useNavigate();

  useEffect(() => {
    const getPlans = async () => {
      try {
        if (!token) return;
        const res = await Apiservice.getAuth(apiEndPoints.plans.get, token);
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
      accessorKey: 'fullName',
      enableSorting: true,
      size: 160,
      Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
      enableSorting: true,
      size: 140,
      Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      header: 'Age',
      accessorKey: 'age',
      enableSorting: true,
      size: 60,
      Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      header: 'Gender',
      accessorKey: 'gender',
      enableSorting: true,
      size: 100,
      Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      header: 'Address',
      accessorKey: 'address',
      enableSorting: true,
      size: 200,
      Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      header: 'Join Date',
      accessorKey: 'joinDate',
      enableSorting: true,
      size: 140,
      Cell: ({ cell }) => {
        const val = cell.getValue();
        return val ? new Date(val).toLocaleDateString() : 'N/A'
      }
    },
    {
      header: 'Expiry Date',
      accessorKey: 'expiryDate',
      enableSorting: true,
      size: 140,
      Cell: ({ cell }) => {
        const val = cell.getValue();
        return val ? new Date(val).toLocaleDateString() : 'N/A'
      }
    },
    {
      header: 'Plan',
      accessorKey: 'planId.planName',
      enableSorting: true,
      size: 110,
      Cell: ({ row }) => row.original?.planId?.planName || 'N/A'
    },
    {
      header: 'Paid Fees',
      accessorKey: 'paidFees',
      enableSorting: true,
      size: 100,
      Cell: ({ cell }) => cell.getValue() !== undefined ? cell.getValue() : 'N/A',
    },
    {
      header: 'Pending Fees',
      accessorKey: 'pendingFees',
      enableSorting: true,
      size: 110,
      Cell: ({ cell }) => cell.getValue() !== undefined ? cell.getValue() : 'N/A',
    },
    {
      header: 'Weight',
      accessorKey: 'weight',
      enableSorting: true,
      size: 80,
      Cell: ({ cell }) => cell.getValue() !== undefined ? cell.getValue() : 'N/A',
    },
    {
      header: 'Goal',
      accessorKey: 'goal',
      enableSorting: true,
      size: 120,
      Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      enableSorting: true,
      size: 100,
      Cell: ({ cell }) => cell.getValue() || 'N/A',
    },
    {
      header: 'Actions',
      accessorKey: '_id',
      size: 120,
      enableSorting: false,
      Cell: ({ cell }) => {      
        const id = cell.getValue();
        return id ? (
          <Dropdown>
            <MenuButtonStyled aria-label="More actions">
              <MoreHorizIcon />
            </MenuButtonStyled>
            <Menu slots={{ listbox: Listbox }} className="z-99999">
              <MenuItemStyled
              onClick={() => {
                setAddRenewOpenModal(prev => !prev);
                setAddPatientsId(cell?.row?.original)
              }}
              >
                Renew Plan
              </MenuItemStyled>
              <MenuItemStyled 
                onClick={() => {
                  setAddOpenModal(prev => !prev);
                  setAddPatientsId(cell?.row?.original)
                }}
              >
                Edit
              </MenuItemStyled>
              <MenuItemStyled
                onClick={() => {
                  handleDelete(cell?.row?.original._id);
                }}
              >Delete</MenuItemStyled>
            </Menu>
          </Dropdown>
        ) : (
          'N/A'
        );
      },
    },
  ];

  // Use useEffect to watch for filter change and get table data from API
  const getMember = async () => {
    try {
      if (!token) {
        throw new Error("Token is missing.")
      }
      let url = `${apiEndPoints.member.expired_members}?status=active`;

      if (searchTerms) url += `&search=${searchTerms}`;
      if (filterName) url += `&search=${filterName}`;
      if (planId) url += `&planId=${planId}`;
      if (pendingFees !== "") url += `&pendingFees=${pendingFees}`;
      if (expiringSoon !== "") url += `&expiringSoon=${expiringSoon}`;
      url += `&one=1`;
 

      url += `&sortBy=${sorting[0]?.id ?? ""}&sortOrder=${sorting[0]?.desc ? "desc" : "asc"}&page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}`

      const res = await Apiservice.getAuth(url, token);

      if (res && res.data.status === 200) {
        setPatient(res.data.data)
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
        getMember()
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getMember();
    // eslint-disable-next-line
  }, [pageState, sorting, searchTerms, planId, pendingFees, expiringSoon, filterName]);

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

  return (
    <>
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Expired Members" />
        <div className="flex gap-3">
      

              <button
            onClick={AddDoctorModal}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
          >
            <span>
              <AddIcon />
            </span>
            Add Members
          </button>
        </div>
      </div>

      {/* Table filters - Name text input, Plan, Pending Fees, Expiring Soon */}
      <div className="flex flex-wrap items-end gap-4 mb-4">
    
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="plan-dropdown-label">Plan</InputLabel>
          <Select
            labelId="plan-dropdown-label"
            label="Plan"
            value={planId}
            onChange={handlePlanChange}
            size="small"
            displayEmpty
          >
            <MenuItem value="">
              <em>Select Plan</em>
            </MenuItem>
            {planIds.map(plan => (
              <MenuItem key={plan._id} value={plan._id}>{plan.planName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="pending-fees-label">Pending Fees</InputLabel>
          <Select
            labelId="pending-fees-label"
            label="Pending Fees"
            value={pendingFees}
            onChange={handlePendingFeesChange}
            size="small"
            displayEmpty
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="expiring-soon-label">Expiring Soon</InputLabel>
          <Select
            labelId="expiring-soon-label"
            label="Expiring Soon"
            value={expiringSoon}
            onChange={handleExpiringSoonChange}
            size="small"
            displayEmpty
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>
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
        getFunction={getMember}
        addPatientsId={addPatientsId}
      />

<AddRenewModel
        openModal={AddRenewOpenModal}
        setOpenAddModal={setAddRenewOpenModal}
        getFunction={getMember}
        addPatientsId={addPatientsId}
      />
    </>
  )
}

export default ExpiredMembers;
