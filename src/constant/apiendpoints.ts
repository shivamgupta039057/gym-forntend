  const apiEndPoints = {
  auth: {
    login: '/auth/login',
    getprofile : '/auth/profile'

  },

  dashboard : {
    get : '/dashboard/stats'
  },

  member : {
    get : '/members/get',
    create : "/members/create",
    renew: '/members/renew-membership',
    expired_members : "/members/expired-members",
    payment_history : "/members/member-payment-history",
    change_status : "/members/change-status",
    delete : '/members/delete',
    update : '/members/edit',
    payment_detials : '/payment',
    all_members: '/members/getallmembers'
  },

  plan:{
   get : "/plan/get",
   create : "/plan/create",
   delete : '/plan/delete',
   update : '/plan/edit'
  },

  attendance : {
    get : '/attendance/get',
    create : '/attendance/create',
    edit : '/attendance/edit',
    delete : '/attendance/delete',

  },
  followUp : {
    get : '/followup/get',
    create : '/followup/create',
    edit : '/followup/edit',
    delete : '/followup/delete',
  }
  
};

export default apiEndPoints