import React, { useState } from 'react';
import { User, Role } from '../types';
import { LockClosedIcon } from '../components/Icons';

interface Props {
    users: User[];
    onAddUser: (user: User) => void;
    onUpdateUser: (user: User) => void;
    onDeleteUser: (id: string) => void;
}

export const UserManagement: React.FC<Props> = ({ users, onAddUser, onUpdateUser, onDeleteUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Form States
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '', // Simulation only
        role: Role.EMPLOYEE as Role
    });

    const filteredUsers = users.filter(u => 
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddNew = () => {
        setEditingUser(null);
        setFormData({ fullName: '', email: '', password: '', role: Role.EMPLOYEE });
        setShowModal(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({ 
            fullName: user.fullName, 
            email: user.email, 
            password: '', // Don't show existing password
            role: user.role 
        });
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus akun ini? Pengguna tidak akan bisa login lagi.')) {
            onDeleteUser(id);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingUser) {
            onUpdateUser({
                ...editingUser,
                fullName: formData.fullName,
                email: formData.email,
                role: formData.role,
                // Avatar logic: preserve or regenerate if name changed significantly? Let's keep simple.
                avatarUrl: editingUser.avatarUrl
            });
        } else {
            onAddUser({
                id: `u_${Date.now()}`,
                fullName: formData.fullName,
                email: formData.email,
                role: formData.role,
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=random`
            });
        }
        setShowModal(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Manajemen Akun</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Kelola akses login, peran (role), dan keamanan akun pengguna.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <input 
                            type="text" 
                            placeholder="Cari user atau email..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-brand-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <button 
                        onClick={handleAddNew}
                        className="bg-brand-blue text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-800 text-sm font-bold whitespace-nowrap transition-colors flex items-center justify-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        Tambah Akun
                    </button>
                </div>
            </div>

            {/* User Table */}
            <div className="bg-white dark:bg-brand-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50/50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pengguna</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role / Hak Akses</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-brand-dark divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover border border-gray-100 dark:border-gray-600" src={user.avatarUrl} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-bold text-gray-900 dark:text-white">{user.fullName}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-bold rounded-full border ${
                                            user.role === Role.ADMIN ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300' : 
                                            user.role === Role.MANAGER ? 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300' : 
                                            'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                            Aktif
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end items-center space-x-2">
                                            <button 
                                                onClick={() => handleEdit(user)}
                                                className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Edit Akun"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Hapus Akun"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-brand-dark w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-fade-in-up">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingUser ? 'Edit Akun Pengguna' : 'Tambah Akun Baru'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                                <input 
                                    required 
                                    type="text" 
                                    value={formData.fullName} 
                                    onChange={e => setFormData({...formData, fullName: e.target.value})} 
                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:outline-none text-sm" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email (Username)</label>
                                <input 
                                    required 
                                    type="email" 
                                    value={formData.email} 
                                    onChange={e => setFormData({...formData, email: e.target.value})} 
                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:outline-none text-sm" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {editingUser ? 'Reset Password (Opsional)' : 'Password'}
                                </label>
                                <div className="relative">
                                    <input 
                                        type="password" 
                                        required={!editingUser}
                                        value={formData.password} 
                                        onChange={e => setFormData({...formData, password: e.target.value})} 
                                        placeholder={editingUser ? "Kosongkan jika tidak diubah" : "******"}
                                        className="w-full pl-10 p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:outline-none text-sm" 
                                    />
                                    <div className="absolute left-3 top-2.5 text-gray-400">
                                        <LockClosedIcon className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role (Hak Akses)</label>
                                <select 
                                    value={formData.role} 
                                    onChange={e => setFormData({...formData, role: e.target.value as Role})} 
                                    className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-blue focus:outline-none text-sm"
                                >
                                    <option value={Role.ADMIN}>Admin (Akses Penuh)</option>
                                    <option value={Role.MANAGER}>Manager (Kelola Tim)</option>
                                    <option value={Role.EMPLOYEE}>Employee (Staff Biasa)</option>
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end space-x-3">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)} 
                                    className="px-5 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2.5 text-sm font-bold text-white bg-brand-blue rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};