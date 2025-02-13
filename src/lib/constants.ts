export const siteSetting = {
  name: 'Seado Safari Semarang',
  description: 'Sewa jetski, Rental Jetski, main jetski di Semarang',
  logo: {
    url: '/images/logo-white.svg',
    alt: 'Seadoo Safari Seamrang Logo',
    href: '/'
  },
  mainMenu: [
    {
      id: 1,
      name: 'explore',
      path: '/explore'
    },
    {
      id: 2,
      name: 'trips',
      path: '/trips',
    },
    {
      id: 3,
      name: 'profile',
      path: '/profile'
    }
  ]
}

export const product = {
  id: 1,
  name: 'Seadoo Safari Semarang',
  price: 1567870,
  quantity: 1
}

export const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
export const midtransServerKey = process.env.MIDTRANS_SERVER_KEY;
