import { __PROD__ } from '../../utils/constants';
import buildDevLogger from './devLogger';
import buildProdLogger from './prodLogger';

export default __PROD__ ? buildProdLogger() : buildDevLogger();
