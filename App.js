import HomePage from './HomePage';
import CreatePage from './CreatePage';
import UserPage from './UserPage';
import FindPage from './FindPage';

import {
  StackNavigator,
} from 'react-navigation';

const App = StackNavigator({
  Home: { screen: HomePage },
  Create: { screen: CreatePage },
  User: { screen: UserPage },
  Find: { screen: FindPage },
});
export default App;
