import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/User.module.css';
import axios from 'axios';
import { baseurl } from '../App';
import toast from 'react-hot-toast';

const User = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${baseurl}/get-user/${id}`);
                if (response.data.success) {
                    setUser(response.data.user);
                    setLoading(false);
                } else {
                    toast.error('Failed to fetch user information.');
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                toast.error('An error occurred while fetching the user.');
            }
        };

        fetchUser();
    }, [id]);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (!user) {
        return <div className={styles.error}>User not found.</div>;
    }

    return (
        <div className={styles.userContainer}>
            <h2 className={styles.heading}>User Details</h2>
            <div className={styles.userDetails}>
                <div className={styles.detailRow}>
                    <span className={styles.label}>Name:</span>
                    <span className={styles.value}>{user.name}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.label}>Age:</span>
                    <span className={styles.value}>{user.age}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.label}>Date of Birth:</span>
                    <span className={styles.value}>{user.dob}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.label}>Gender:</span>
                    <span className={styles.value}>{user.gender}</span>
                </div>
                <div className={styles.detailRow}>
                    <span className={styles.label}>About:</span>
                    <span className={styles.value}>{user.about}</span>
                </div>
            </div>
        </div>
    );
};

export default User;
