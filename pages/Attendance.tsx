import React, { useState } from 'react';
import { ATTENDANCE_RECORDS, EMPLOYEES } from '../services/mockData';
import { AttendanceStatus, Role, User } from '../types';

interface Props {
    user: User;
}

export const Attendance: React.FC<Props> = ({ user }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    
    // Filter records by selected date
    // Note: In a real app, this would be an API call. For mock, we simulate data.
    const records = ATTENDANCE_RECORDS.filter(r => r.date === selectedDate);

    const getStatusColor = (status: AttendanceStatus) => {
        switch (status) {
            case AttendanceStatus.PRESENT: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case AttendanceStatus.ABSENT: return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case AttendanceStatus.LATE: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case AttendanceStatus.ON_LEAVE: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: AttendanceStatus) => {
        switch (status) {
            case AttendanceStatus.PRESENT: return 'Hadir';
            case AttendanceStatus.ABSENT: return 'Alpha';
            case AttendanceStatus.LATE: return 'Telat';
            case AttendanceStatus.ON_LEAVE: return 'Cuti/Izin';
            default: return status;
        }
    };

    const handleClockIn = () => {
        alert("Berhasil Absen Masuk pada " + new Date().toLocaleTimeString());
    };

    return (
        <div className="space-y-8 animate-fade-in">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Monitor Absensi</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pantau kehadiran karyawan, lembur, dan status cuti.</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Employee Clock In Action */}
                    <button 
                        onClick={handleClockIn}
                        className="bg-brand-blue hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Absen Masuk
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-brand-dark rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Filter Tanggal:</span>
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-white dark:bg-brand-dark border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full pl-3 p-2"
                        />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Menampilkan data untuk {new Date(selectedDate).toLocaleDateString('id-ID')}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Karyawan</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Masuk</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Keluar</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lembur</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-brand-dark divide-y divide-gray-200 dark:divide-gray-700">
                            {EMPLOYEES.map(emp => {
                                const record = records.find(r => r.employeeId === emp.id);
                                return (
                                    <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                             <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8">
                                                    <img className="h-8 w-8 rounded-full object-cover border border-gray-100 dark:border-gray-600" src={emp.user.avatarUrl} alt="" />
                                                </div>
                                                <div className="ml-3">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">{emp.user.fullName}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{emp.employeeIdNumber}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-mono">
                                            {record?.checkIn || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-mono">
                                            {record?.checkOut || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {record ? (
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                                                    {getStatusText(record.status)}
                                                </span>
                                            ) : (
                                                 <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                                    Tidak Ada Data
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700 dark:text-gray-300">
                                            {record?.overtimeHours ? `+${record.overtimeHours} jam` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-brand-blue hover:text-blue-900 dark:hover:text-blue-300">Edit</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};