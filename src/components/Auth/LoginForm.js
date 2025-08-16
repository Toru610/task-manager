import React, { useState, useEffect } from 'react';
import { login } from '../../components/api/authAPI';
import Navbar from './Navbar'; 
import "../styles/LoginForm.css";

export default function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formState, setFormState] = useState({ isSubmitting: false, error: null });

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const lightImage = "https://d1j8r0kxyu9tj8.cloudfront.net/files/QcLkrhUEBkhWkVRFYWTYyAWoza8dObTJ8fqKfvLz.jpg";
  const darkImage = "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQlJUNOdlebOs1ed3c9cJWG5L_D-9ZwEr7w1TWVw3R18T3Pyqhg";
  const currentImage = theme === "light" ? lightImage : darkImage;

  const validateField = (name, value) => {
    let errorMsg = '';
    if (!value.trim()) {
      if (name === 'username') errorMsg = 'Vui lòng nhập tên đăng nhập';
      if (name === 'password') errorMsg = 'Vui lòng nhập mật khẩu';
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usernameError = validateField('username', formData.username);
    const passwordError = validateField('password', formData.password);

    if (usernameError || passwordError) {
      const firstErrorField = usernameError ? 'username' : 'password';
      document.querySelector(`[name="${firstErrorField}"]`)?.focus();
      return;
    }

    setFormState({ ...formState, isSubmitting: true, error: null });
    try {
      const result = await login(formData);
      onLogin(result.user);
    } catch (error) {
      if (error.name === 'TypeError') {
        setFormState((prev) => ({ ...prev, error: 'Không thể kết nối đến server' }));
      } else if (error.message.includes('400')) {
        setFormState((prev) => ({ ...prev, error: 'Dữ liệu không hợp lệ' }));
      } else if (error.message.includes('404')) {
        setFormState((prev) => ({ ...prev, error: 'Không tìm thấy API' }));
      } else {
        setFormState((prev) => ({ ...prev, error: 'Đã xảy ra lỗi: ' + error.message }));
      }
    } finally {
      setFormState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <div className="login-page">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <div className="login-container">
        <div className="login-card">
          <div className="login-image">
            <img src={currentImage} alt="Login Visual" />
          </div>
          <div className="login-form">
            <h2>Đăng nhập</h2>
            {formState.error && <p className="error">{formState.error}</p>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Tên đăng nhập"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={errors.username ? "input-error" : ""}
                />
                {errors.username && <p className="error">{errors.username}</p>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? "input-error" : ""}
                />
                {errors.password && <p className="error">{errors.password}</p>}
              </div>

              <button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}