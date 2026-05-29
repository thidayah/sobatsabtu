'use client';

import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AttendanceStatus {
  id: string;
  code: string;
  is_attendance: boolean;
  event: {
    date: string;
    name: string;
    is_active: boolean;
  };
  member: {
    email: string;
    gender: string;
    full_name: string;
    ig_username: string;
  };
}

export const QRScannerModal = ({ isOpen, onClose }: QRScannerModalProps) => {
  const [scanning, setScanning] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "qr-scanner-container";
  const [containerReady, setContainerReady] = useState(false);

  // Ensure container is ready when modal opens and scanning is true
  useEffect(() => {
    if (isOpen && scanning) {
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        const container = document.getElementById(scannerContainerId);
        if (container) {
          setContainerReady(true);
        } else {
          setCameraError("Scanner container not found. Please refresh and try again.");
          setScanning(false);
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, scanning]);

  // Start scanner when container is ready
  useEffect(() => {
    if (!containerReady || !scanning) return;

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(scannerContainerId);
        html5QrCodeRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // QR Code detected
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
              html5QrCodeRef.current.stop().catch(console.error);
              setScanning(false);
              setContainerReady(false);
              handleCodeDetected(decodedText);
            }
          },
          (errorMessage) => {
            // Ignore scanning errors
          }
        );
      } catch (err) {
        console.error("Camera error:", err);
        if (err === "No camera found.") {
          setCameraError("No camera detected on this device. Please make sure you have a camera connected.");
        } else {
          setCameraError("Unable to access camera. Please make sure you've granted camera permissions.");
        }
        setScanning(false);
        setContainerReady(false);
      }
    };

    startScanner();

    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(console.error);
      }
    };
  }, [containerReady, scanning]);

  const resetState = () => {
    setAttendanceData(null);
    setError(null);
    setCameraError(null);
    setShowConfirm(false);
  };

  const handleStartScanning = () => {
    resetState();
    setScanning(true);
    setContainerReady(false);
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setScanning(false);
    setContainerReady(false);
  };

  const handleCodeDetected = async (code: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/registrations/${code}/attendance-status`);
      const result = await response.json();

      if (result.success) {
        setAttendanceData(result.data);
        setShowConfirm(true);
      } else {
        setError(result.message || "Invalid QR code");
      }
    } catch (err) {
      setError("Failed to verify QR code. Please try again.");
      console.error("Error checking attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmAttendance = async () => {
    if (!attendanceData) return;

    setUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/registrations/${attendanceData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_attendance: true }),
      });
      
      const result = await response.json();

      if (result.success) {
        setAttendanceData(prev => prev ? { ...prev, is_attendance: true } : null);
        setShowConfirm(false);
      } else {
        setError(result.message || "Failed to update attendance");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error updating attendance:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleScanAnother = () => {
    resetState();
    handleStartScanning();
  };

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg mx-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <Icon icon="lucide:qr-code" width="24" height="24" className="text-sobat-blue" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Scan QR Code for Attendance
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
          >
            <Icon icon="lucide:x" width="20" height="20" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Camera Permission Error */}
          {cameraError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{cameraError}</p>
              <button
                onClick={handleStartScanning}
                className="mt-2 text-sm text-sobat-blue hover:underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Other Errors */}
          {error && !cameraError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Not scanning - show start button */}
          {!scanning && !showConfirm && !loading && !attendanceData && !cameraError && (
            <div className="text-center py-8">
              <Icon icon="lucide:qr-code" width="64" height="64" className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Click the button below to start scanning participant's QR code
              </p>
              <button
                onClick={handleStartScanning}
                className="px-6 py-3 bg-sobat-blue text-white hover:bg-blue-600 transition-colors cursor-pointer rounded-full"
              >
                <Icon icon="lucide:camera" width="20" height="20" className="inline mr-2" />
                Start Camera
              </button>
            </div>
          )}

          {/* Scanning - show camera preview */}
          {scanning && (
            <div>
              <div id={scannerContainerId} className="w-full min-h-[300px] bg-gray-100 dark:bg-gray-800" />
              <button
                onClick={stopScanner}
                className="mt-4 text-sm text-red-600 hover:text-red-700 dark:text-red-400 cursor-pointer"
              >
                Cancel Scan
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-sobat-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Verifying QR code...</p>
            </div>
          )}

          {/* Confirmation inside modal */}
          {showConfirm && attendanceData && (
            <div>
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon="lucide:check-circle" width="20" height="20" className="text-green-500" />
                  <span className="font-medium text-green-700 dark:text-green-400">QR Code Valid</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Registration found! Please confirm attendance below.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Participant</p>
                  <p className="font-medium text-gray-900 dark:text-white">{attendanceData.member.full_name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{attendanceData.member.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Event</p>
                  <p className="font-medium text-gray-900 dark:text-white">{attendanceData.event.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(attendanceData.event.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Status</p>
                  <span className={`px-2 py-1 text-xs font-medium ${
                    attendanceData.is_attendance 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {attendanceData.is_attendance ? 'Already Attended' : 'Not Attended Yet'}
                  </span>
                </div>
              </div>

              {attendanceData.is_attendance ? (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 mb-4">
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    This participant has already been marked as attended.
                  </p>
                  <button
                    onClick={handleScanAnother}
                    className="mt-2 text-sm text-sobat-blue hover:underline cursor-pointer"
                  >
                    Scan Another QR Code
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleScanAnother}
                    className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Scan Another
                  </button>
                  <button
                    onClick={confirmAttendance}
                    disabled={updating}
                    className="flex-1 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {updating ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      'Confirm Attendance'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Success state after attendance marked */}
          {attendanceData?.is_attendance && !showConfirm && !loading && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <Icon icon="lucide:check" width="32" height="32" className="text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Attendance Confirmed!
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {attendanceData.member.full_name} has been marked as attended for<br />
                <span className="font-medium">{attendanceData.event.name}</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleScanAnother}
                  className="flex-1 py-2 bg-sobat-blue text-white hover:bg-blue-600 transition-colors"
                >
                  Scan Another
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};