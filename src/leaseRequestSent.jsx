import { useNavigate,useLocation } from "react-router-dom"

export default function  LeaseRequestSent(){
    const navigate = useNavigate();
    const location = useLocation();
    const formData = location.state?.formData;
    console.log(formData)

    return(
        <div>
            <p>
                Thank you.
                Your request lease was sent succesfully .
                Wait for post owner to approve .
                if approved ,you will see it in your Dashboard,with your request with status approved.&nbsp;
                <strong>please don't send another request on this prperty</strong>
            </p>

            <button onClick={()=>navigate("/",{state:{formData : formData}})}>Go Back to homepage</button>
        </div>
    )
}