import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './auth';

const functions = getFunctions(app);

export const analyzeFundusImage = httpsCallable(functions, 'analyzeFundusImage');