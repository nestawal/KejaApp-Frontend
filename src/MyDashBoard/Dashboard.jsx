import {useLocation,useNavigate } from 'react-router-dom';

export default function Dashboard(){
    const location = useLocation();
    const navigate = useNavigate();

    const formData = location.state || {};
    console.log(formData)

    function goToComp(s){
        navigate(`/${s}`,{state: {formData}})
        console.log("clicked :",s);
    }
    return(
        <div>
            <div className='AccountDetails'>
                <p><strong>name:</strong>{formData.name}</p>
                <p><strong>email:</strong>{formData.email}</p>
                <p><strong>account balance:</strong>ksh{formData.balance}</p>
            </div>
            <div className="Dashboard">
                <div className="dashComp" onClick={() => goToComp("posts")}>My properties </div>
                <div  className="dashComp" onClick={() => goToComp("myRequests")}>Requested</div>
                <div  className="dashComp" onClick={() => goToComp("myLeased")}>Leased</div>
            </div>
        </div>
    )
}