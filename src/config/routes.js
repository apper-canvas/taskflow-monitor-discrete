import HomePage from '../components/pages/HomePage';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: HomePage
  }
};

export const routeArray = Object.values(routes);