import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'tableau de bord',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'gestion des athlètes',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Faire la présence',
    path: '/absence',
    icon: icon('ic_disabled'),
  },
  {
    title: 'gestion des absences',
    path: '/absences-consultation',
    icon: icon('ic_lock'),
  },
  {
    title: 'gestion des clubs',
    path: '/clubs',
    icon: icon('ic_user'),
  },
  {
    title: 'parametrages',
    path: '/parametrages',
    icon: icon('ic_blog'),
  },


  // {
  //   title: 'product',
  //   path: '/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
