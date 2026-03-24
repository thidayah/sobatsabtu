import { normalizePhoneNumber } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useState } from "react";

interface RegistrationFormProps {
  id: string;
  current_participants: number;
  max_participants: number;
  is_active: boolean;
}

export const RegistrationForm = ({
  id,
  current_participants,
  max_participants,
  is_active
}: RegistrationFormProps) => {
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ title: '', message: '', type: 'success' });

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    gender: '',
    ig_username: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_notes: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };

  // Search member by email or IG username
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const response = await fetch(`/api/members/search?email=${encodeURIComponent(searchQuery)}&ig_username=${encodeURIComponent(searchQuery)}`);
      const result = await response.json();

      if (result.success && result.data) {
        const member = result.data;
        setFormData({
          full_name: member.full_name || '',
          email: member.email || '',
          gender: member.gender || '',
          ig_username: member.ig_username || '',
          emergency_contact_name: member.emergency_contact_name || '',
          emergency_contact_phone: member.emergency_contact_phone || '',
          medical_notes: member.medical_notes || ''
        });
        setSearchResult(member);

        // Auto hide after 3 seconds
        setTimeout(() => {
          setSearchResult(null);
        }, 3000);
      } else {
        setSearchResult({ error: 'Member not found' });
        setTimeout(() => {
          setSearchResult(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error searching member:', error);
      setSearchResult({ error: 'Search failed' });
      setTimeout(() => {
        setSearchResult(null);
      }, 3000);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.full_name || !formData.email || !formData.gender || !formData.emergency_contact_name || !formData.emergency_contact_phone) {
      setPopupMessage({
        title: 'Missing Fields',
        message: 'Please fill in all required fields (*)',
        type: 'error'
      });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: id,
          full_name: formData.full_name,
          email: formData.email,
          ig_username: formData.ig_username,
          gender: formData.gender,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: normalizePhoneNumber(formData.emergency_contact_phone),
          medical_notes: formData.medical_notes
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPopupMessage({
          title: 'Registration Successful!',
          message: result.message || 'You have successfully registered for this event. Check your email for confirmation.',
          type: 'success'
        });

        // Reset form
        setFormData({
          full_name: '',
          email: '',
          gender: '',
          ig_username: '',
          emergency_contact_name: '',
          emergency_contact_phone: '',
          medical_notes: ''
        });
        setSearchQuery('');
      } else {
        setPopupMessage({
          title: 'Registration Failed',
          message: result.error || result.message || 'Something went wrong. Please try again.',
          type: 'error'
        });
      }
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5000);
    } catch (error) {
      console.error('Error submitting registration:', error);
      setPopupMessage({
        title: 'Registration Failed',
        message: 'Network error. Please check your connection and try again.',
        type: 'error'
      });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Check if event is closed or sold out
  const isEventClosed = !is_active;
  const isSoldOut = current_participants >= max_participants;

  if (isEventClosed) {
    return (
      <div className="text-center py-12 px-4 bg-gray-50 dark:bg-gray-900 ">
        <Icon icon="lucide:lock" width="48" height="48" className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Event Closed</h3>
        <p className="text-gray-500 dark:text-gray-400">
          This event is no longer accepting registrations.
        </p>
      </div>
    );
  }

  if (isSoldOut) {
    return (
      <div className="text-center py-12 px-4 bg-gray-50 dark:bg-gray-900 ">
        <Icon icon="lucide:alert-circle" width="48" height="48" className="mx-auto text-orange-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Sold Out</h3>
        <p className="text-gray-500 dark:text-gray-400">
          All {max_participants} spots for this event have been filled.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl md:text-2xl font-bold mb-6">Register for this event</h2>

      {/* Popup Notification */}
      {/* {showPopup && ( */}
      <div className={`fixed top-20 md:top-28 right-4 z-50 max-w-md transform transition-all duration-300 ease-out ${showPopup ? 'translate-x-0' : 'translate-x-[125%]'} `}>
        <div className={`p-4 shadow-xl flex items-start gap-3 border backdrop-blur-sm ${popupMessage.type === 'success'
          ? 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800'
          : 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800'
          }`}>
          <Icon
            icon={popupMessage.type === 'success' ? 'lucide:check-circle' : 'lucide:x-circle'}
            width="24"
            height="24"
            className={`flex-shrink-0 ${popupMessage.type === 'success' ? 'text-green-500' : 'text-red-500'
              }`}
          />
          <div className="flex-1">
            <h4 className={`font-semibold text-sm ${popupMessage.type === 'success'
              ? 'text-green-800 dark:text-green-300'
              : 'text-red-800 dark:text-red-300'
              }`}>
              {popupMessage.title}
            </h4>
            <p className={`text-xs mt-1 ${popupMessage.type === 'success'
              ? 'text-green-700 dark:text-green-400'
              : 'text-red-700 dark:text-red-400'
              }`}>
              {popupMessage.message}
            </p>
          </div>
          <button
            onClick={() => setShowPopup(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors flex-shrink-0"
          >
            <Icon icon="lucide:x" width="16" height="16" />
          </button>
        </div>
      </div>
      {/* )} */}

      {/* Search Section */}
      <div className="mb-8 p-3 md:p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
        <p className="text-xs md:text-base text-gray-600 dark:text-gray-400 mb-4">
          Enter your email or instagram username to auto-fill your details if you've registered before.
        </p>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type email or IG username..."
              className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all "
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            className="px-6 py-2 bg-sobat-blue text-white rounded-full font-medium hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {searchLoading ? (
              <Icon icon="lucide:loader-2" className=" size-4 md:size-5 animate-spin" />
            ) : (
              <Icon icon="lucide:search" className=" size-4 md:size-5" />
            )}
            <span className="text-sm md:text-base">Search</span>
          </button>
        </div>

        {/* Search Result */}
        {searchResult && (
          <div className={`mt-4 p-4  ${searchResult.error
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${searchResult.error
                ? 'bg-red-100 dark:bg-red-900'
                : 'bg-green-100 dark:bg-green-900'
                }`}>
                <Icon
                  icon={searchResult.error ? 'lucide:alert-circle' : 'lucide:check'}
                  width="20"
                  height="20"
                  className={searchResult.error ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}
                />
              </div>
              <div>
                <p className="text-sm md:text-base font-medium">
                  {searchResult.error ? 'Member not found' : 'Member found!'}
                </p>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                  {searchResult.error
                    ? 'No member found with that email or username.'
                    : 'Your details have been auto-filled below.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all "
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all "
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            {['male', 'female', 'other'].map((g, index) => (
              <label key={index} className="flex items-center gap-2 cursor-pointer text-sm md:text-base">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={() => handleGenderChange(g)}
                  className="w-4 h-4 text-sobat-blue"
                />
                <span className="capitalize">{g}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Username Instagram */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Instagram Username
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
            <input
              type="text"
              name="ig_username"
              value={formData.ig_username}
              onChange={handleChange}
              className="w-full px-3 py-2 pl-8 text-sm md:text-base border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all "
              placeholder="username"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            We'll tag you in our event photos!
          </p>
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Emergency Contact <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="emergency_contact_name"
              value={formData.emergency_contact_name}
              onChange={handleChange}
              className="px-3 py-2 text-sm md:text-base border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all "
              placeholder="Contact name"
              required
            />
            <input
              type="tel"
              name="emergency_contact_phone"
              value={formData.emergency_contact_phone}
              onChange={handleChange}
              className="px-3 py-2 text-sm md:text-base border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all "
              placeholder="Phone number"
              required
            />
          </div>
        </div>

        {/* Conditions/Medical Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Medical Notes / Conditions
          </label>
          <textarea
            name="medical_notes"
            value={formData.medical_notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 text-sm md:text-base border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-sobat-blue dark:focus:ring-sobat-yellow transition-all resize-none "
            placeholder="Any medical conditions, allergies, or special requirements we should know about? (Optional)"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This information helps us ensure your safety during the activity.
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 py-4 text-sm md:text-base bg-gradient-to-r from-sobat-blue to-blue-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <Icon icon="lucide:loader-2" width="20" height="20" className="animate-spin" />
            ) : (
              <Icon icon="mdi:paper-plane" width="20" height="20" className="group-hover:scale-110 transition-transform" />
            )}
            {loading ? 'Processing...' : 'Send Registration'}
          </button>
        </div>
      </form>
    </div>
  );
};