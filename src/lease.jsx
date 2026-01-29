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
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const url = "https://kejaapp-backend.onrender.com";

    // FIX: Ensure personId is a string
    const [newReq, setNewReq] = useState({
        postId: id,
        personId: formData?._id?.toString() || '', // Convert ObjectId to string
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
        setSubmitting(true);

        // Validate form data
        if (!formData || !formData._id || !formData.name) {
            alert("User data missing. Please login again.");
            setSubmitting(false);
            return;
        }

        if (newReq.months <= 0) {
            alert("Please enter a valid number of months");
            setSubmitting(false);
            return;
        }

        // FIX: Ensure all data is in correct format for backend
        const requestData = {
            postId: String(id).trim(), // Use the id directly from URL params
            personId: String(formData._id).trim(), // Use formData._id directly
            months: Number(newReq.months),
            name: String(formData.name).trim()
        };

        console.log("Sending to backend:", requestData);

        try {
            const response = await axios.patch(`${url}/requests/addNewreq`, requestData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log("Success:", response.data);
            
            navigate("/requestSent", { 
                state: { 
                    formData: formData,
                    requestDetails: {
                        months: newReq.months,
                        property: post?.posts?.name
                    }
                } 
            });
            
        } catch (error) {
            console.error("Full error:", error);
            
            let errorMessage = "Failed to submit request.";
            
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
                console.error("Backend error message:", errorMessage);
            }
            
            alert(`Error: ${errorMessage}`);
        } finally {
            setSubmitting(false);
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

    if (!formData || !formData._id || !formData.name) {
        return (
            <div>
                <h2>Session Error</h2>
                <p>Your session has expired or user data is missing.</p>
                <button onClick={() => navigate("/login")}>Go to Login</button>
            </div>
        );
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
                            value={newReq.months || ''} 
                            min="1" 
                            placeholder="input no of months" 
                            onChange={handleChange}
                            disabled={submitting}
                        />
                    </u> 
                    months until a renewal of lease contract can be finalized.
                </p>

                <button 
                    onClick={handleSubmit} 
                    disabled={newReq.months <= 0 || submitting}
                >
                    {submitting ? 'Submitting...' : 
                     newReq.months <= 0 ? 'Enter number of months' : 
                     `Submit ${newReq.months}-month Request`}
                </button>
                
                {submitting && <p>Please wait while we process your request...</p>}
            </div>
        </div>
    );
}