import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const toastNotification = (message:string) => {
    toast.success(message, {
        position: toast.POSITION.TOP_CENTER,
        });
}