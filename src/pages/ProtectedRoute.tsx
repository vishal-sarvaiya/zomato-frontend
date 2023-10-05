import React from 'react'
import { Navigate} from 'react-router-dom'
import { useUser } from '../utils/user.context';

const ProtectedRoute = ({ Component, allowedRoles, ...rest }: any) => {
    const { isLoggedIn, role} = useUser()
    if(!isLoggedIn) {
        return <Navigate to="/"  replace />
    }
    function hasAccess(role: string, allowedRoles: string) {
        return allowedRoles.includes(role);
    }

   
    if (!hasAccess(role, allowedRoles)) {
        console.log("unauthorised! access not allowed");
        return <Navigate to="/unauthorised" />;
    }
    return (
        <Component/>
    )
}
export default ProtectedRoute

































// return (
//     <Component/>
//     // <Routes>
//     //     <Route {...rest} element={<Component />} />
//     // </Routes>
// )