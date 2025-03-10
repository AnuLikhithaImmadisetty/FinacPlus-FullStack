import React, { useState, useEffect } from 'react';
import styles from '../styles/SignupForm.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { baseurl } from '../App';
import toast from 'react-hot-toast';
import axios from 'axios';

const EditUserForm = () => {
  const { id } = useParams(); 
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dob: '',
    gender: '',
    password: '',
    about: '',
  });

  const [genders, setGenders] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
        try {
          const response = await axios.get(`${baseurl}/get-user/${id}`);
          const userData = response.data.user;
      
          const dobParts = userData.dob.split('-');
          const formattedDob = `${dobParts[2]}-${dobParts[0].padStart(2, '0')}-${dobParts[1].padStart(2, '0')}`;
      
          setFormData({
            name: userData.name || '',
            age: userData.age || '',
            dob: formattedDob, 
            gender: userData.gender || '',
            password: '', 
            about: userData.about || '',
          });
        } catch (error) {
          toast.error('Failed to fetch user data');
        }
      };
      

    const fetchGenders = async () => {
      try {
        const response = await axios.get(`${baseurl}/get-gender`);
        setGenders(response.data.genders || []);
      } catch (error) {
        toast.error('Failed to fetch gender options');
      }
    };

    fetchUserData();
    fetchGenders();
  }, [id]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value || '' }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name, age, dob, gender, password, about } = formData;
    if (!name || !age || !dob || !gender || !password || !about) {
      toast.error('All fields are required');
      return; 
    }
  
    const dobParts = formData.dob.split('-');
    const formattedDob = `${dobParts[1].padStart(2, '0')}-${dobParts[2].padStart(2, '0')}-${dobParts[0]}`;
  
    const dataToSubmit = {
      ...formData,
      age : Number(age),
      dob: formattedDob, 
    };
  
    try {
      const response = await axios.put(`${baseurl}/edit-user/${id}`, dataToSubmit);
      toast.success(response.data.message);
      navigate('/view-users');
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Something went wrong');
      } else {
        toast.error('Check the console if you are a developer');
        console.error(error);
      }
    }
  };
  
  

  const handleReset = () => {
    setFormData({
      name: '',
      age: '',
      dob: '',
      gender: '',
      password: '',
      about: '',
    });
  };

  return (
    <div className={styles.formContainer}>
      <h2>Edit User</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>Your name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Your age</label>
          <select
            name="age"
            value={formData.age}
            onChange={handleChange}
          >
            <option value="">Select age</option>
            {Array.from({ length: 120 }, (_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label>Date of birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select gender</option>
            {genders && genders.map((gender, index) => (
              <option key={index} value={gender}>{gender}</option>
            ))}
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label>Enter Password to edit</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className={styles.toggleButton}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label>About</label>
          <textarea
            name="about"
            placeholder="Tell us about yourself"
            value={formData.about}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleReset}
          >
            Reset
          </button>
          <button type="submit" className={styles.submitButton}>Update</button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
