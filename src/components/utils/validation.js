export const validateField = (name, value) => {
  if (!value || !value.trim()) {
    return `${name} không được để trống`;
  }
  return '';
};

export const validateLogin = (username, password) => {
  return {
    username: validateField('Tên đăng nhập', username),
    password: validateField('Mật khẩu', password)
  };
};

export const validateTask = (task) => {
  if (!task.title?.trim()) return 'Tiêu đề không được để trống';
  if (!task.description?.trim()) return 'Mô tả không được để trống';
  if (!task.dueDate?.trim()) return 'Ngày hết hạn không được để trống';
  return '';
};