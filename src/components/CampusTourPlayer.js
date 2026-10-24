import { Platform } from 'react-native';
import CampusTourPlayerWeb from './CampusTourPlayer.web';
import CampusTourPlayerNative from './CampusTourPlayer.native';

export default Platform.OS === 'web' ? CampusTourPlayerWeb : CampusTourPlayerNative;
