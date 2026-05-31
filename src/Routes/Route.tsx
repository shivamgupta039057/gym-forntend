import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Loader from '../common/Loader';
import PageTitle from '../components/PageTitle';
import SignIn from '../pages/Authentication/SignIn';
import ECommerce from '../pages/Dashboard/ECommerce';
import localStorageKeys from '../constant/localStorageKeys';
import { ROUTES_CONST } from '../constant/routeConstant';
import Protected from './ProtectedRoutes';
import DefaultLayout from '../layout/DefaultLayout';
import Page404 from '../pages/Page404.tsx';
import Members from '../pages/MemberPagess/Member.tsx';
import ExpiredMembers from '../pages/MemberPagess/ExpiredMember.tsx';
import PlanPage from '../pages/plans/Plans.tsx';
import MemberPaymentHistory from '../pages/MemberPagess/PaymentHistory.tsx';
import AttendancePage from '../pages/AttendancePage/AttendancePage.tsx';
import FollowUpPage from '../pages/followUp/FollowUpPage.tsx';
import InvoiceView from '../pages/MemberPagess/invoice/InvoiceView.tsx';

function AllRoutes() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const isAuthenticated = localStorage.getItem(localStorageKeys.token);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const routeConfig = [
    { path: ROUTES_CONST.HOME, component: ECommerce },
    {path : ROUTES_CONST.MEMBERS, component: Members },
    {path : ROUTES_CONST.EXPIRED_MEMBERS, component: ExpiredMembers },
    {path : ROUTES_CONST.PLANS, component: PlanPage },
    {path : ROUTES_CONST.ATTENDANCE, component: AttendancePage },
    {path : ROUTES_CONST.FOLLOWUPS, component: FollowUpPage },
    {path : `${ROUTES_CONST.MEMBER_PAYMENT_HISTORY}/:memberId`, component: MemberPaymentHistory },
    {path : `${ROUTES_CONST.INVOICE_VIEW}/:paymentID`, component: InvoiceView },



  ];

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>

        <Route
          path={ROUTES_CONST.AUTH.SIGNIN}
          element={
            isAuthenticated ? (
              <Navigate to={ROUTES_CONST.HOME} replace />
            ) : (
              <>
                <PageTitle title="Signin" />
                <SignIn />
              </>
            )
          }
        />

        <Route element={<DefaultLayout />}>
          {routeConfig?.map((item) => {

            return(
              <Route
              key={item?.path}
              path={item?.path}
              element={<Protected Component={item?.component} />}
            />
            )
          })}
        </Route>

        
        
      <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default AllRoutes;

