import React, { useState, useEffect } from 'react';
import styles from '../styles/ViewUsers.module.css';
import { FaEye, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { baseurl } from '../App';
import axios from 'axios';
import toast  from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [password, setPassword] = useState('');
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const usersPerPage = 10;

  const navigate = useNavigate();

  const handleViewClick = (userId) => {
      navigate(`/user/${userId}`);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseurl}/get-all-user`);
        if (response.data.success) {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteClick = (userId) => {
    setUserIdToDelete(userId);
    setShowPopup(true);
  };

  const handleCancelDelete = () => {
    setShowPopup(false);
    setPassword('');
    setUserIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
        console.log(password);
        const response = await axios.delete(`${baseurl}/delete-user/${userIdToDelete}`, { data: { password } });

        if (response.data.success) {
            toast.success('User deleted successfully!');
            setUsers(users.filter(user => user._id !== userIdToDelete));
            handleCancelDelete();
        } else {
            toast.error(response.data.message || 'Failed to delete user.'); 
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        const errorMessage = error.response?.data?.message || 'An error occurred while deleting the user.';
        toast.error(errorMessage);
    }
};



  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div className={styles.tableContainer}>
      <h2>User List</h2>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Created On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.dob}</td>
              <td>{user.gender}</td>
              <td>{user.createdOn}</td>
              <td className={styles.actions}>
                <FaEye className={styles.icon} onClick={() => handleViewClick(user._id)} title="View" />
                <FaEdit className={styles.icon} onClick={() => navigate(`/edit-user/${user._id}`)} title="Edit" />
                <FaTrashAlt className={styles.icon} title="Delete" onClick={() => handleDeleteClick(user._id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {showPopup && (
          <div className={styles.popup}>
              <div className={styles.popupContent}>
                  <h3>Confirm Deletion</h3>
                  <p>Enter password of this user to delete.</p>
                  <input 
                      type="password" 
                      placeholder="Password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className={styles.passwordInput}
                  />
                  <div className={styles.popupActions}>
                      <button onClick={handleCancelDelete} className={styles.cancelButton}>Cancel</button>
                      <button onClick={handleConfirmDelete} className={styles.deleteButton}>Delete</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default ViewUsers;
