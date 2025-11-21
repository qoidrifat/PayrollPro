import React, { useState } from 'react';
import { AttendanceRecord, AttendanceStatus, Role, User, Employee } from '../types';
import { CameraIcon, ImageIcon, QrCodeIcon } from '../components/Icons';

interface Props {
    user: User;
    employees: Employee[];
    attendanceRecords: AttendanceRecord[];
    onAttendanceSubmit: (record: AttendanceRecord) => void;
}

export const Attendance: React.FC<Props> = ({ user, employees, attendanceRecords, onAttendanceSubmit }) => {
    // Default to today
    const todayStr = new Date().toISOString().slice(0, 10);
    const [selectedDate, setSelectedDate] = useState(todayStr);
    
    // Attendance Form States
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState<'IN' | 'OUT'>('IN');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attendanceImage, setAttendanceImage] = useState<string | null>(null);
    
    // QR Code States (For Admin View)
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrType, setQrType] = useState<'IN' | 'OUT'>('IN'); 

    // Image View Modal State
    const [viewImage, setViewImage] = useState<string | null>(null);
    
    // Check if the selected date is "Today"
    const isToday = selectedDate === todayStr;
    
    // Filter records by selected date
    // IMPORTANT: This derives state directly from props, ensuring real-time updates when parent state changes
    const records = attendanceRecords.filter(r => r.date === selectedDate);

    // LOGIC: Filter employees based on Role
    const displayedEmployees = user.role === Role.EMPLOYEE
        ? employees.filter(e => e.userId === user.id)
        : employees;

    // Find Current Employee Profile
    const currentEmployee = employees.find(e => e.userId === user.id);

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

    // Generate QR Payload based on selected Type (IN/OUT)
    const qrPayload = JSON.stringify({
        company: 'PayrollPro',
        date: selectedDate, 
        type: qrType, 
        token: 'secure_random_token_123' 
    });

    const handleShowQR = () => {
        if (!isToday) return; 
        setShowQRModal(true);
    };

    const handleOpenActionModal = () => {
        if (!currentEmployee) {
            alert("Data karyawan tidak ditemukan untuk akun ini.");
            return;
        }
        setAttendanceImage(null);
        setShowActionModal(true);
        
        // Auto-detect IN or OUT based on existing record
        const existingRecord = attendanceRecords.find(r => r.employeeId === currentEmployee.id && r.date === todayStr);
        if (existingRecord && existingRecord.checkIn && !existingRecord.checkOut) {
            setActionType('OUT');
        } else {
            setActionType('IN');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttendanceImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitAttendance = () => {
        if (!attendanceImage) {
            alert("Wajib menyertakan bukti foto (Selfie atau Foto QR Code)!");
            return;
        }
        if (!currentEmployee) return;

        const existingRecord = attendanceRecords.find(r => r.employeeId === currentEmployee.id && r.date === todayStr);

        if (actionType === 'IN' && existingRecord) {
             alert("Anda sudah melakukan Check-In hari ini! Gunakan Check-Out jika ingin pulang.");
             return;
        }
        
        if (actionType === 'OUT' && (!existingRecord || !existingRecord.checkIn)) {
             if(!window.confirm("Anda belum Check-In hari ini. Lanjut Check-Out?")) return;
        }

        setIsSubmitting(true);
        
        // Simulate Short Network Latency for Realism (Quick 500ms)
        setTimeout(() => {
            const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

            let newRecord: AttendanceRecord;

            if (actionType === 'IN') {
                // Create New Record - Instant ID generation
                newRecord = {
                    id: `att-${currentEmployee.id}-${Date.now()}`,
                    employeeId: currentEmployee.id,
                    date: todayStr,
                    status: AttendanceStatus.PRESENT, // Logic for LATE can be added here based on time
                    checkIn: timeNow,
                    checkOut: undefined,
                    proofImageUrl: attendanceImage,
                    overtimeHours: 0
                };
            } else {
                // Update Existing Record (Check-out)
                if (existingRecord) {
                    newRecord = {
                        ...existingRecord,
                        checkOut: timeNow,
                        // Calculate overtime simply (if checkout > 17:00)
                        overtimeHours: parseInt(timeNow.split(':')[0]) > 17 ? parseInt(timeNow.split(':')[0]) - 17 : 0
                    };
                } else {
                    // Edge case: Checkout without Checkin
                    newRecord = {
                        id: `att-${currentEmployee.id}-${Date.now()}`,
                        employeeId: currentEmployee.id,
                        date: todayStr,
                        status: AttendanceStatus.PRESENT,
                        checkIn: '-',
                        checkOut: timeNow,
                        proofImageUrl: attendanceImage
                    };
                }
            }

            // Send to Parent (Updates Global State -> Triggers Re-render -> Real-time Update)
            onAttendanceSubmit(newRecord);

            setIsSubmitting(false);
            setShowActionModal(false);
            
        }, 500); 
    };

    return (
        <div className="space-y-8 animate-fade-in relative">
             {/* Image Viewer Modal */}
             {viewImage && (
                 <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setViewImage(null)}>
                     <div className="relative max-w-3xl max-h-screen">
                         <img src={viewImage} alt="Bukti Absensi" className="rounded-lg shadow-2xl max-h-[80vh]" />
                         <button className="absolute -top-10 right-0 text-white hover:text-gray-300" onClick={() => setViewImage(null)}>Tutup</button>
                     </div>
                 </div>
             )}

             {/* QR Code Modal (Admin) */}
             {showQRModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-brand-dark p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center relative border border-gray-200 dark:border-gray-700 animate-fade-in-up">
                        <button 
                            onClick={() => setShowQRModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Absensi QR Code</h3>
                        
                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6 relative">
                             <div 
                                className={`absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-brand-blue rounded-lg shadow transition-all duration-300 ${qrType === 'OUT' ? 'translate-x-full' : 'translate-x-0'}`}
                             ></div>
                             <button 
                                onClick={() => setQrType('IN')}
                                className={`flex-1 relative z-10 py-2 text-sm font-bold transition-colors ${qrType === 'IN' ? 'text-brand-blue dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                             >
                                Masuk
                             </button>
                             <button 
                                onClick={() => setQrType('OUT')}
                                className={`flex-1 relative z-10 py-2 text-sm font-bold transition-colors ${qrType === 'OUT' ? 'text-brand-blue dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                             >
                                Keluar
                             </button>
                        </div>

                        <div className="bg-white p-4 rounded-xl border-2 border-gray-100 inline-block mb-6 relative">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrPayload)}`} 
                                alt="Attendance QR Code" 
                                className="w-48 h-48"
                            />
                        </div>
                        
                        <div className={`px-4 py-2 rounded-lg text-xs font-bold animate-pulse ${qrType === 'IN' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                             Mode: {qrType === 'IN' ? 'Check-In' : 'Check-Out'}
                        </div>
                    </div>
                </div>
             )}

             {/* Employee Action Modal (Attendance Form with Image Upload) */}
             {showActionModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-brand-dark w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-fade-in-up overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Catat Kehadiran</h3>
                            <button onClick={() => setShowActionModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {/* Type Selector */}
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setActionType('IN')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                                        actionType === 'IN' 
                                        ? 'border-brand-blue bg-blue-50 dark:bg-blue-900/20 text-brand-blue' 
                                        : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-brand-blue/50'
                                    }`}
                                >
                                    <span className="font-bold text-lg">Masuk</span>
                                    <span className="text-xs opacity-70">Check-In</span>
                                </button>
                                <button 
                                    onClick={() => setActionType('OUT')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                                        actionType === 'OUT' 
                                        ? 'border-brand-orange bg-pink-50 dark:bg-pink-900/20 text-brand-orange' 
                                        : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-brand-orange/50'
                                    }`}
                                >
                                    <span className="font-bold text-lg">Keluar</span>
                                    <span className="text-xs opacity-70">Check-Out</span>
                                </button>
                            </div>

                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                                    Bukti Kehadiran (Selfie / QR Code Manual) <span className="text-red-500">*</span>
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                                    Gunakan opsi ini jika pemindaian kamera gagal. Silakan upload foto selfie di lokasi atau <strong>foto QR Code fisik</strong> yang ada di kantor.
                                </p>
                                
                                {!attendanceImage ? (
                                    <div className="relative">
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            capture="user"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                                            <div className="flex space-x-3 mb-3">
                                                <div className="bg-brand-blue/10 p-3 rounded-full text-brand-blue group-hover:scale-110 transition-transform">
                                                    <CameraIcon className="w-6 h-6" />
                                                </div>
                                                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                                    <QrCodeIcon className="w-6 h-6" />
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-center">Klik untuk ambil foto atau upload</p>
                                            <p className="text-xs mt-1">Mendukung Selfie atau Foto QR</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                                        <img src={attendanceImage} alt="Preview" className="w-full h-48 object-cover" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => setAttendanceImage(null)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600"
                                            >
                                                Hapus & Foto Ulang
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg flex items-center justify-between text-sm">
                                <span className="text-gray-500">Waktu Saat Ini</span>
                                <span className="font-mono font-bold text-gray-900 dark:text-white">
                                    {new Date().toLocaleTimeString('id-ID')}
                                </span>
                            </div>

                            <button 
                                onClick={handleSubmitAttendance}
                                disabled={isSubmitting || !attendanceImage}
                                className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg flex justify-center items-center space-x-2 transition-all ${
                                    isSubmitting || !attendanceImage 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : actionType === 'IN' 
                                        ? 'bg-brand-blue hover:bg-blue-700 shadow-blue-500/30' 
                                        : 'bg-brand-orange hover:bg-pink-600 shadow-pink-500/30'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <span>Kirim Bukti {actionType === 'IN' ? 'Masuk' : 'Keluar'}</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
             )}

             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Monitor Absensi</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {user.role === Role.EMPLOYEE 
                            ? `Riwayat Kehadiran: ${user.fullName}` 
                            : 'Pantau kehadiran karyawan, lembur, dan bukti foto secara Real-time.'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Admin Action: Generate QR */}
                    {(user.role === Role.ADMIN || user.role === Role.MANAGER) && (
                        <button 
                            onClick={handleShowQR}
                            disabled={!isToday}
                            className={`px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center ${
                                isToday 
                                    ? 'bg-brand-blue hover:bg-blue-700 text-white shadow-blue-500/30' 
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500 shadow-none'
                            }`}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                            {isToday ? 'Tampilkan QR' : 'QR Tertutup'}
                        </button>
                    )}

                    {/* Employee Action: Perform Attendance */}
                    {user.role === Role.EMPLOYEE && (
                        <button 
                            onClick={handleOpenActionModal}
                            disabled={!isToday}
                             className={`px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center text-white ${
                                isToday 
                                    ? 'bg-gradient-to-r from-brand-blue to-brand-purple hover:from-blue-600 hover:to-purple-600 shadow-blue-500/30' 
                                    : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <CameraIcon className="w-5 h-5 mr-2" />
                            Catat Kehadiran
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-brand-dark rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">Filter Tanggal:</span>
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-white dark:bg-brand-dark border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full pl-3 p-2"
                        />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-right w-full sm:w-auto">
                        {!isToday && <span className="text-red-500 font-bold mr-2">⚠️ Melihat Data Lampau</span>}
                        {user.role === Role.EMPLOYEE 
                            ? 'Menampilkan data Anda sendiri.' 
                            : `Menampilkan data seluruh karyawan (${displayedEmployees.length}).`}
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
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bukti</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-brand-dark divide-y divide-gray-200 dark:divide-gray-700">
                            {displayedEmployees.map(emp => {
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
                                                    Belum Absen
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700 dark:text-gray-300">
                                            {record?.overtimeHours ? `+${record.overtimeHours} jam` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {record?.proofImageUrl ? (
                                                <button 
                                                    onClick={() => setViewImage(record.proofImageUrl!)}
                                                    className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-md flex items-center ml-auto"
                                                >
                                                    <ImageIcon className="w-4 h-4 mr-1" />
                                                    Lihat
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400">-</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {displayedEmployees.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                        Data karyawan tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};