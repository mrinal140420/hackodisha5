import { useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [name, setName] = useState(localStorage.getItem('name'));

  const login = ({ token, role, name }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    setToken(token);
    setRole(role);
    setName(name);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setName(null);
  };

  return { token, role, name, login, logout };
}
