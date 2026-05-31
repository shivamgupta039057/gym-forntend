import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.js';
import { Apiservice } from '../../service/apiservice.js';
import apiEndPoints from '../../constant/apiendpoints.js';
import localStorageKeys from '../../constant/localStorageKeys.js';
import { MaterialReactTable, MRT_SortingState } from 'material-react-table';
import toast from 'react-hot-toast';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { ROUTES_CONST } from '../../constant/routeConstant.js';
import AddMembersModal from './AddMemberRegistration.js';
import AddRenewModel from './AddRenewModel.js';
import ChangeStatusModel from './ChangeStatusModel.js';
import ViewProfileModel from './ViewProfile.js';

// Custom styled components
const Listbox = styled('ul')`
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 12px;
  margin: 12px 0;
  min-width: 150px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: #fff;
  border: 1px solid #DAE2ED;
  color: #1C2025;
  box-shadow: 0px 4px 6px rgba(0,0,0, 0.05);
  z-index: 1;
`;

const MenuItemStyled = styled(BaseMenuItem)`
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
`;

const MenuButtonStyled = styled(BaseMenuButton)`
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 3px 6px;
  border-radius: 8px;
  color: #B0B8C4;
  transition: all 150ms ease;
  cursor: pointer;
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
`;

const Members: React.FC = () => {
  const [members, setMembers] = useState([]);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMemberObj, setSelectedMemberObj] = useState<any>(null);
  const [totalCount, setTotalCount] = useState<number>(1);
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 });
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showRenewModal, setShowRenewModal] = useState<boolean>(false);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState<boolean>(false);
  const [ShowProfileModal, setShowProfileModal] = useState<boolean>(false);
  
  const [planList, setPlanList] = useState<Array<{ _id: string, planName: string }>>([]);
  const [filterPlanId, setFilterPlanId] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPendingFees, setFilterPendingFees] = useState<string>('');
  const [filterExpiringSoon, setFilterExpiringSoon] = useState<string>('');

  const token = localStorage.getItem(localStorageKeys.token);
  const navigate = useNavigate();

  // Fetch plan list
  useEffect(() => {
    (async function () {
      try {
        if (!token) return;
        const res = await Apiservice.getAuth(apiEndPoints.plan.get, token);
        if (res?.data?.status === 200) setPlanList(res.data.data || []);
      } catch {
        setPlanList([]);
      }
    })();
  }, [token]);

  // Table columns
  const columns = useMemo(() => [
    {
      header: 'No.',
      accessorKey: "SrNo",
      size: 60,
      Cell: ({ row }: any) => row.index + 1 + pageState.pageIndex * pageState.pageSize,
      enableSorting: false,
      enableColumnActions: false,
    },
    {
      header: 'Full Name',
      accessorKey: 'fullName',
      size: 160,
      enableSorting: true,
      Cell: ({ cell, row }: { cell: any, row: any }) => {
        const name = cell.getValue();
        const memberId = row.original?._id;
        if (!name || !memberId) return 'N/A';
        return (
          <span
            style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => navigate(`/member-payment-history/${memberId}`)}
          >
            {name}
          </span>
        );
      },
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
      size: 120,
      enableSorting: true,
      Cell: ({ cell }: any) => cell.getValue() || 'N/A',
    },
    {
      header: 'Age',
      accessorKey: 'age',
      size: 50,
      enableSorting: true,
      Cell: ({ cell }: any) => cell.getValue() || 'N/A',
    },
    {
      header: 'Gender',
      accessorKey: 'gender',
      size: 80,
      enableSorting: true,
      Cell: ({ cell }: any) => cell.getValue() || 'N/A',
    },
    {
      header: 'Address',
      accessorKey: 'address',
      size: 180,
      enableSorting: true,
      Cell: ({ cell }: any) => cell.getValue() || 'N/A',
    },
    {
      header: 'Join',
      accessorKey: 'joinDate',
      size: 110,
      enableSorting: true,
      Cell: ({ cell }: any) => {
        const val = cell.getValue();
        return val ? new Date(val).toLocaleDateString() : 'N/A';
      }
    },
    {
      header: 'Expire',
      accessorKey: 'expiryDate',
      size: 110,
      enableSorting: true,
      Cell: ({ cell }: any) => {
        const val = cell.getValue();
        return val ? new Date(val).toLocaleDateString() : 'N/A';
      }
    },
    {
      header: 'Plan',
      accessorKey: 'planId.planName',
      size: 110,
      enableSorting: true,
      Cell: ({ row }: any) => row.original?.planId?.planName || 'N/A'
    },
    {
      header: 'Paid',
      accessorKey: 'paidFees',
      size: 80,
      enableSorting: true,
      Cell: ({ cell }: any) =>
        cell.getValue() !== undefined ? cell.getValue() : 'N/A',
    },
    {
      header: 'Pending',
      accessorKey: 'pendingFees',
      size: 110,
      enableSorting: true,
      Cell: ({ cell }: any) =>
        cell.getValue() !== undefined ? cell.getValue() : 'N/A',
    },
    {
      header: 'Weight',
      accessorKey: 'weight',
      size: 70,
      enableSorting: true,
      Cell: ({ cell }: any) =>
        cell.getValue() !== undefined ? cell.getValue() : 'N/A',
    },
    {
      header: 'Goal',
      accessorKey: 'goal',
      size: 100,
      enableSorting: true,
      Cell: ({ cell }: any) => cell.getValue() || 'N/A',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      size: 90,
      enableSorting: true,
      Cell: ({ cell }: any) => cell.getValue() || 'N/A',
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
                onClick={() => {
                  setShowProfileModal(true);
                  setSelectedMemberObj(memberObj);
                }}
              >
                View Profile
              </MenuItemStyled>

              <MenuItemStyled
                onClick={() => {
                  setShowRenewModal(true);
                  setSelectedMemberObj(memberObj);
                }}
              >
                Renew Plan
              </MenuItemStyled>
              <MenuItemStyled
                onClick={() => {
                  setShowChangeStatusModal(true);
                  setSelectedMemberObj(memberObj);
                }}
              >
                Change Status
              </MenuItemStyled>
              <MenuItemStyled 
                onClick={() => {
                  setShowAddModal(true);
                  setSelectedMemberObj(memberObj);
                }}
              >
                Edit
              </MenuItemStyled>
              <MenuItemStyled
                onClick={() => handleDelete(id)}
              >Delete</MenuItemStyled>
            </Menu>
          </Dropdown>
        ) : 'N/A';
      },
    },
  // eslint-disable-next-line
  ], [navigate, pageState]);

  // Fetch members: new design and dependencies
  const fetchMembers = useCallback(async () => {
    try {
      if (!token) throw new Error("Token not found");
      let url = `${apiEndPoints.member.get}?status=`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (filterPlanId) url += `&planId=${filterPlanId}`;
      if (filterStatus) url += `&status=${filterStatus}`;
      if (filterPendingFees !== '') url += `&pendingFees=${filterPendingFees}`;
      if (filterExpiringSoon !== '') url += `&expiringSoon=${filterExpiringSoon}`;
      url += `&sortBy=${sorting[0]?.id ?? ""}&sortOrder=${sorting[0]?.desc ? "desc" : "asc"}&page=${pageState.pageIndex + 1}&perPage=${pageState.pageSize}`;
      const res = await Apiservice.getAuth(url, token);
      if (res && res.data.status === 200) {
        setMembers(res.data.data);
        setTotalCount(res?.data?.pagination?.totalItems || 1);
      }
    } catch (error: any) {
      setMembers([]);
      toast.error(error?.response?.data?.message || "Error fetching members");
    }
  }, [token, pageState, sorting, searchTerm, filterPlanId, filterStatus, filterPendingFees, filterExpiringSoon]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Delete handler
  const handleDelete = async (id: string) => {
    try {
      if (!token) throw new Error("Token required");
      const body = { id };
      const res = await Apiservice.postAuth(apiEndPoints.member.delete, body, token);
      if (res && res.data.status === 200) {
        toast.success(res.data.message);
        fetchMembers();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // Render
  return (
    <>
      <div className="flex justify-between items-start sm:items-center mb-6 gap-3 flex-col sm:flex-row">
        <Breadcrumb pageName="Members" />
        <div className="flex gap-3">
          <button
            onClick={() => navigate(ROUTES_CONST.EXPIRED_MEMBERS)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
          >
            <span>
              <span role="img" aria-label="View">
                <svg xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }} width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 4.5c-5.053 0-8.667 4.123-9.658 6.087a1.822 1.822 0 0 0 0 1.825C3.333 14.376 6.947 18.5 12 18.5c5.054 0 8.667-4.124 9.658-6.088a1.824 1.824 0 0 0 0-1.825C20.667 8.623 17.054 4.5 12 4.5Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/>
                </svg>
              </span>
            </span>
            View Expired Members
          </button>
          <button
            onClick={() => { setShowAddModal(true); setSelectedMemberObj(null); }}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-black px-5 py-3 text-center font-medium text-white hover:bg-opacity-90"
          >
            <span><AddIcon /></span>
            Add Members
          </button>
        </div>
      </div>

      {/* Table filters */}
      <div className="flex flex-wrap items-end gap-4 mb-4">
      <FormControl sx={{ minWidth: 140, mr: 2 }}>
          <InputLabel id="filter-status-label">Status</InputLabel>
          <Select
            labelId="filter-status-label"
            label="Status"
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPageState(ps => ({ ...ps, pageIndex: 0 })); }}
            size="small"
            displayEmpty
          >
            <MenuItem value=""><em>Select Status</em></MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="expired">Expired</MenuItem>
            <MenuItem value="left">Left</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 140, mr: 2 }}>
          <InputLabel id="filter-plan-label">Plan</InputLabel>
          <Select
            labelId="filter-plan-label"
            label="Plan"
            value={filterPlanId}
            onChange={e => { setFilterPlanId(e.target.value); setPageState(ps => ({ ...ps, pageIndex: 0 })); }}
            size="small"
            displayEmpty
          >
            <MenuItem value=""><em>Select Plan</em></MenuItem>
            {planList.map(plan => (
              <MenuItem key={plan._id} value={plan._id}>{plan.planName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 110, mr: 2 }}>
          <InputLabel id="filter-pending-label">Pending</InputLabel>
          <Select
            labelId="filter-pending-label"
            label="Pending"
            value={filterPendingFees}
            onChange={e => { setFilterPendingFees(e.target.value); setPageState(ps => ({ ...ps, pageIndex: 0 })); }}
            size="small"
            displayEmpty
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="filter-expiring-label">Expiring</InputLabel>
          <Select
            labelId="filter-expiring-label"
            label="Expiring"
            value={filterExpiringSoon}
            onChange={e => { setFilterExpiringSoon(e.target.value); setPageState(ps => ({ ...ps, pageIndex: 0 })); }}
            size="small"
            displayEmpty
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="table-container capitalize">
        <MaterialReactTable
          columns={columns}
          data={members}
          manualPagination
          manualSorting
          paginationDisplayMode="pages"
          rowCount={totalCount}
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
          onPaginationChange={setPageState}
        />
      </div>
      <AddMembersModal
        openModal={showAddModal}
        setOpenAddModal={setShowAddModal}
        getFunction={fetchMembers}
        addPatientsId={selectedMemberObj}
      />
      <AddRenewModel
        openModal={showRenewModal}
        setOpenAddModal={setShowRenewModal}
        getFunction={fetchMembers}
        addPatientsId={selectedMemberObj}
      />
       <ChangeStatusModel
        openModal={showChangeStatusModal}
        setOpenAddModal={setShowChangeStatusModal}
        getFunction={fetchMembers}
        addPatientsId={selectedMemberObj}
      />
      <ViewProfileModel
        openModal={ShowProfileModal}
        setOpenAddModal={setShowProfileModal}
        getFunction={fetchMembers}
        addPatientsId={selectedMemberObj}
      />
    </>
  );
};

export default Members;
