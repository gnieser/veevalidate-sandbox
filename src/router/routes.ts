import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => Promise.resolve('No Router Used'),
  },
];

export default routes;
