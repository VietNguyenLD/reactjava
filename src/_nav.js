export default {
  items: [
    // {
    //   name: 'Thiết lập',
    //   icon: 'icon-settings',
    //   children: [
    //     { name: 'Module', url: '/module', icon: 'icon-notebook' },
    //     { name: 'Bill', url: '/bill', icon: 'icon-bag' },
    //     { name: 'Partner', url: '/Partner', icon: 'icon-people' },
    //     { name: 'Postoffice', url: '/postoffice', icon: 'icon-home' },
    //     { name: 'Province', url: '/province', icon: 'icon-home' },
    //     { name: 'District', url: '/district', icon: 'icon-home' },
    //     { name: 'Ward', url: '/ward', icon: 'icon-home' },
    //     { name: 'Zone', url: '/zone', icon: 'icon-home' },
    //   ],
    // },
    {
      name:"Quản lý user",
      url:"/users",
      icon:"icon-notebook"
    },
    {
      name: 'Quản lý khuyến mãi',
      icon: 'icon-tag',
      children: [
        { name: 'Danh sách khuyến mãi', url: '/promotion', icon: 'icon-credit-card' }
      ]
    },
    // {
    //   name: 'Quản lý File',
    //   icon: 'icon-tag',
    //   children: [
    //     { name: 'Quản lý File', url: '/upload', icon: 'icon-credit-card' }
    //   ]
    // }
  ]
};
