import { createCampaign, dashboard, logout, payment, profile, withdraw } from '/public/assets';

export const navlinks = [
  {
    name: '/',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: '/Followers',
    imgUrl: createCampaign,
    link: '/Followers',
  },
  {
    name: '/Following',
    imgUrl: payment,
    link: '/Following',
  },
  {
    name: '/Mutual',
    imgUrl: withdraw,
    link: '/Mutual'
  },
  {
    name: '/Profile',
    imgUrl: profile,
    link: '/Profile',
  },
  {
    name: 'logout',
    imgUrl: logout,
    link: '/',
    disabled: true,
  },
];
