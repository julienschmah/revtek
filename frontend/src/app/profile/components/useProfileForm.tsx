'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import * as userService from '@/services/user.service';
import { updatePassword } from '@/services/auth.service';

// Interface para tipos de campos do usuário
export interface UserFormData {
  name: string;
  email: string;
  cpf: string;
  cnpj: string;
  phone: string;
  birthDate: string;
  address: string;
  addressNumber: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  companyName: string;
  isSeller: boolean;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Lista de estados brasileiros
export const ESTADOS_BRASILEIROS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export function useProfileForm() {
  const { user, updateUserData } = useAuth();
  const [formData, setFormData] = useState<UserFormData>({
    name: user?.name || '',
    email: user?.email || '',
    cpf: user?.cpf || '',
    cnpj: user?.cnpj || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
    address: user?.address || '',
    addressNumber: user?.addressNumber || '',
    complement: user?.complement || '',
    neighborhood: user?.neighborhood || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    companyName: user?.companyName || '',
    isSeller: user?.isSeller || false
  });

  // Campos de senha
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Estados de UI
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [isBecomingSeller, setIsBecomingSeller] = useState(false);

  // Verifica se o usuário está tentando se tornar vendedor
  useEffect(() => {
    if (formData.isSeller && !user?.isSeller) {
      setIsBecomingSeller(true);
    } else {
      setIsBecomingSeller(false);
    }
  }, [formData.isSeller, user?.isSeller]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  // Validar CPF (simplificado)
  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    return cleanCPF.length === 11 || cpf === '';
  };

  // Validar CNPJ (simplificado)
  const validateCNPJ = (cnpj: string) => {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
    return cleanCNPJ.length === 14 || cnpj === '';
  };

  // Formatar CPF ao digitar
  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  };

  // Formatar CNPJ ao digitar
  const formatCNPJ = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
  };

  // Formatar CEP ao digitar
  const formatCEP = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
  };

  // Formatar telefone ao digitar
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleSpecialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'cnpj') {
      formattedValue = formatCNPJ(value);
    } else if (name === 'zipCode') {
      formattedValue = formatCEP(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (isBecomingSeller) {
      if (!formData.phone) {
        setValidationError('Telefone é obrigatório para vendedores');
        return;
      }
      if (!formData.address || !formData.city || !formData.state || !formData.zipCode) {
        setValidationError('Endereço completo é obrigatório para vendedores');
        return;
      }
    }
    
    if (formData.cpf && !validateCPF(formData.cpf)) {
      setValidationError('CPF inválido');
      return;
    }
    
    if (formData.cnpj && !validateCNPJ(formData.cnpj)) {
      setValidationError('CNPJ inválido');
      return;
    }
    
    setIsUpdating(true);
    setUpdateSuccess(false);
    setValidationError('');

    try {
      const updatedUser = await userService.updateCurrentUser(formData);
      updateUserData(updatedUser);
      setUpdateSuccess(true);
      window.scrollTo({top: 0, behavior: 'smooth'});
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setValidationError(err.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordSuccess(false);
    setValidationError('');

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      setValidationError('As senhas não coincidem');
      setIsChangingPassword(false);
      return;
    }

    if (newPassword.length < 6) {
      setValidationError('A senha deve ter pelo menos 6 caracteres');
      setIsChangingPassword(false);
      return;
    }

    try {
      await updatePassword({
        currentPassword,
        newPassword
      });
      setPasswordSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setValidationError(err.response?.data?.message || 'Erro ao atualizar senha');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const clearAllMessages = () => {
    setUpdateSuccess(false);
    setPasswordSuccess(false);
    setValidationError('');
  };

  return {
    user,
    formData,
    passwordData,
    isUpdating,
    isChangingPassword,
    updateSuccess,
    passwordSuccess,
    validationError,
    isBecomingSeller,
    handleInputChange,
    handlePasswordChange,
    handleSpecialInputChange,
    handleUpdateProfile,
    handleChangePassword,
    clearAllMessages
  };
}
