import React, { useState, useEffect } from 'react';
import styles from '../styles/SignupForm.module.css';
import { useNavigate } from 'react-router-dom';
import { baseurl } from '../App';
import toast from 'react-hot-toast';
import axios from 'axios';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dob: '',
    gender: '',
    password: '',
    about: '',
  });

  const [errors, setErrors] = useState({
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
    const fetchGenders = async () => {
      try {
        const response = await axios.get(`${baseurl}/get-gender`);
        setGenders(response.data.genders);
      } catch (error) {
        toast.error('Failed to fetch gender options');
      }
    };

    fetchGenders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));

    if (name === 'age' || name === 'dob') {
      setErrors((prevErrors) => ({ ...prevErrors, dob: '' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }

  };

  const handleBlur = (e) => {
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: '' }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const validateForm = () => {
    let formIsValid = true;
    let newErrors = { ...errors };
  
    if (!formData.name) {
      newErrors.name = 'Name is required.';
      formIsValid = false;
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
      formIsValid = false;
    } else if (/\d/.test(formData.name)) {
      newErrors.name = 'Name cannot contain numbers.';
      formIsValid = false;
    } else {
      newErrors.name = ''; 
    }
  
    if (!formData.age) {
      newErrors.age = 'Age is required.';
      formIsValid = false;
    } else if (formData.age < 0 || formData.age > 120 || isNaN(formData.age)) {
      newErrors.age = 'Age must be a number between 0 and 120.';
      formIsValid = false;
    } else {
      newErrors.age = ''; 
    }
  
    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required.';
      formIsValid = false;
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();
      const birthYear = dob.getFullYear();
      const currentYear = today.getFullYear();
      let age = currentYear - birthYear;
  
      if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
      }
  
      if (dob > today || isNaN(dob.getTime())) {
        newErrors.dob = 'Please enter a valid date of birth.';
        formIsValid = false;
      } else if (parseInt(formData.age, 10) !== age) {
        newErrors.dob = `DOB and age are inconsistent. CORRECT AGE: ${age}`;
        formIsValid = false;
      } else {
        newErrors.dob = ''; 
      }
    }
  
    if (!formData.password) {
      newErrors.password = 'Password is required.';
      formIsValid = false;
    } else if (formData.password.length < 10 || !/\d/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      newErrors.password = 'Password must be at least 10 characters long and contain both letters and numbers.';
      formIsValid = false;
    } else {
      newErrors.password = ''; 
    }
  
    if (!formData.about) {
      newErrors.about = 'About section is required.';
      formIsValid = false;
    } else if (formData.about.length > 5000) {
      newErrors.about = 'About section cannot exceed 5000 characters.';
      formIsValid = false;
    } else {
      newErrors.about = ''; 
    }
  
    if (!formData.gender) {
      newErrors.gender = 'Gender is required.';
      formIsValid = false;
    } else {
      newErrors.gender = ''; 
    }
  
    setErrors(newErrors);
    return formIsValid;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const formDataWithNumberAge = {
        ...formData,
        age: Number(formData.age),
      };
  
      const dob = new Date(formData.dob);
      const formattedDob = `${(dob.getMonth() + 1).toString().padStart(2, '0')}-${dob.getDate().toString().padStart(2, '0')}-${dob.getFullYear()}`;
  
      const finalFormData = {
        ...formDataWithNumberAge,
        dob: formattedDob,
      };
  
      try {
        const response = await axios.post(`${baseurl}/add-user`, finalFormData);
        console.log(response)
        toast.success(response.data.message);
        console.log('Form submitted successfully');
        setFormData({
          name: '',
          age: '',
          dob: '',
          gender: '',
          password: '',
          about: '',
        });
        navigate('/view-users');
      } catch (error) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message || 'Something went wrong');
        } else {
          console.log(error)
          toast.error('check the console if you are a developer');
        }
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
    setErrors({
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
      <h2>Create a new user</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>Full Name📝</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>
        <div className={styles.inputGroup}>
          <label>Age 🔢</label>
          <select
            name="age"
            value={formData.age}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">Choose your age</option>
            {Array.from({ length: 120 }, (_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
          </select>
          {errors.age && <p className={styles.error}>{errors.age}</p>}
        </div>
        <div className={styles.inputGroup}>
          <label>Date of Birth 📅</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.dob && <p className={styles.error}>{errors.dob}</p>}
        </div>
        <div className={styles.inputGroup}>
          <label>Gender 🚻</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">Select your gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Prefer not to say">Prefer not to say</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className={styles.error}>{errors.gender}</p>}
        </div>
        <div className={styles.inputGroup}>
          <label>Password 🔒</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Create a strong password "
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <button
              type="button"
              className={styles.toggleButton}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>
        <div className={styles.inputGroup}>
          <label>About You 📝</label>
          <textarea
            name="about"
            placeholder="Tell us a little about yourself..."
            value={formData.about}
            onChange={handleChange}
            onBlur={handleBlur}
          ></textarea>
          {errors.about && <p className={styles.error}>{errors.about}</p>}
        </div>
        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleReset}
          >
            Reset
          </button>
          <button type="submit" className={styles.submitButton}>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
