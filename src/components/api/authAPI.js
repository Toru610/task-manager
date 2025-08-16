const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const login = async (credentials) => {
  const res = await fetch(`${API_BASE_URL}/users`);
  const users = await res.json();
  const foundUser = users.find(
    (u) => u.username === credentials.username && u.password === credentials.password);
  if (foundUser) {
    return { token: 'fake-token', user: foundUser };
  } else {
    throw new Error('Sai tên đăng nhập hoặc mật khẩu');
  }
};

export const logout = async () => Promise.resolve();