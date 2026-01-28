import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Lease() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const formData = location.state?.formData;
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const url = "https://kejaapp-backend.onrender.com";
    //const url = "http://localhost:3001"

    const [newReq, setNewReq] = useState({
        postId: id,
        personId: formData?._id || '',
        months: 0
    });

    useEffect(() => {
        const findPost = async () => {
            try {
                setLoading(true);
                const result = await axios.get(`${url}/Post/${id}`);
                setPost(result.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load property details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            findPost();
        }
    }, [id]);

    function handleChange(e) {
        const { name, value } = e.target;
        setNewReq(prev => ({
            ...prev,
            [name]: parseInt(value) || 0
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!formData || !formData._id) {
            alert("User data missing. Please try again.");
            return;
        }

        if (newReq.months <= 0) {
            alert("Please enter a valid number of months");
            return;
        }

        try {
            await axios.patch(`${url}/requests/addNewreq`, {
                postId: newReq.postId,
                personId: newReq.personId,
                months: newReq.months,
                name: formData.name
            });
            
            navigate("/requestSent", { state: { formData: formData } });
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Failed to submit request. Please try again.");
        }
    }

    if (loading) {
        return <div>Loading property details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!post || !post.posts) {
        return <div>No property found</div>;
    }

    if (!formData) {
        return <div>User data not found. Please go back and try again.</div>;
    }

    return (
        <div>
            <div>
                <u><h1>Digital lease for request</h1></u>
                
                <p>
                    I,&nbsp;<strong>{formData.name}</strong>, hereby confirm my agreement to lease the residential property located at ,&nbsp; 
                    <strong>{post.posts.location}</strong> for the monthly rent of&nbsp;
                    <strong>ksh {post.posts.price}</strong>. 
                    This offer is made based on the current advertised terms and my satisfactory review of the property condition. 
                    I want to rent this property for&nbsp; 
                    <u>
                        <input 
                            type="number" 
                            id="rentMonths" 
                            name="months"  
                            value={newReq.months} 
                            min="1" 
                            placeholder="input no of months" 
                            onChange={handleChange}  
                        />
                    </u> 
                    months until a renewal of lease contract can be finalized.
                </p>

                <button onClick={handleSubmit} disabled={newReq.months <= 0}>
                    {newReq.months <= 0 ? 'Enter number of months' : 'Submit Request'}
                </button>
            </div>
        </div>
    );
}