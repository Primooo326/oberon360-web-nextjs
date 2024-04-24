import { ToastContainer } from "react-toastify";
import "./MainLayout.css"
import 'react-toastify/dist/ReactToastify.css';
export default function MainLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en">
            <body>
                {children}
                <ToastContainer />
            </body>
        </html>
    )
}
