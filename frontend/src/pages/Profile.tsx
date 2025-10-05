import React, { useContext, useState, useEffect } from "react";
import MainLayOut from "../layouts/MainLayOut";
import { UserContext } from "../context/userContext";
import { countryTimezones } from "../้helper/country";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";
import { useNavigate } from "react-router-dom";
import Modal from "../components/ModalScreen";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
interface ProfileForm {
  fullName: string;
  lastName: string;
  gender: string;
  phone: string;
  country: string;
  timezone: string;
}

const fetchUserData = async () => {
  const response = await axiosInstance.get(API_PATH.USER.GETUSERPROFILE);
  return response.data.user;
};
function Profile() {
  const user = useContext(UserContext);
  const { clearUser } = useContext(UserContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: userData = [],
    isLoading,
    error,
  } = useQuery({
    queryFn: fetchUserData,

    queryKey: ["userData"],
  });
  const [form, setForm] = useState<ProfileForm>({
    fullName: "",
    lastName: "",
    gender: "",
    phone: "",
    country: "",
    timezone: "",
  });
  const [isEditButtonPressed, setIsEditButtonPressed] =
    useState<boolean>(false);
  useEffect(() => {
    if (userData) {
      setForm({
        fullName: userData.fullName || userData.username || "",
        lastName: userData.lastname || "",
        gender: userData.gender || "",
        phone: userData.phone || "",
        country: userData.country || "",
        timezone: userData.timezone || "",
      });
    }
  }, [userData]);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const updateProfileMutation = useMutation({
    mutationFn: (profile: ProfileForm) =>
      axiosInstance.put(API_PATH.USER.UPDATEPROFILE(), profile),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userData"] }),
  });
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent page reload
    try {
      await updateProfileMutation.mutateAsync(form);
      setIsEditButtonPressed(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };
  const handleLogout = async () => {
    try {
      clearUser();
      localStorage.removeItem("token");

      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to fetch data</p>;

  return (
    <MainLayOut>
  <div className="profile-container"> {/* ปรับจากเดิม */}
        <div className="flex justify-between items-center mb-4"> {/* ...existing code... */}
          <h3 className="profile-title">{user.user?.username}</h3> {/* ปรับจากเดิม */}
          <button
            className={`profile-btn px-4 py-1 text-sm ${
              isEditButtonPressed ? "bg-gray-400 cursor-not-allowed" : ""
            }`} /* ปรับจากเดิม */
            type="button"
            disabled={isEditButtonPressed}
            onClick={() => setIsEditButtonPressed(true)}
          >
            Edit
          </button>
        </div>

        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col mb-2">
              <label className="profile-label mb-2">Full Name</label> {/* ปรับจากเดิม */}
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className={`profile-input ${!isEditButtonPressed ? "cursor-not-allowed" : ""}`} /* ปรับจากเดิม */
                placeholder="Your firstname"
                disabled={!isEditButtonPressed}
              />

              <label className="profile-label mb-2">Last Name</label> {/* ปรับจากเดิม */}
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={`profile-input ${!isEditButtonPressed ? "cursor-not-allowed" : ""}`} /* ปรับจากเดิม */
                placeholder="Your lastname"
                disabled={!isEditButtonPressed}
              />

              <label className="profile-label mb-2">Gender</label> {/* ปรับจากเดิม */}
              <select
                name="gender"
                className={`profile-select ${!isEditButtonPressed ? "cursor-not-allowed" : ""}`} /* ปรับจากเดิม */
                value={form.gender}
                onChange={handleChange}
                disabled={!isEditButtonPressed}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="profile-label mb-2">Country</label> {/* ปรับจากเดิม */}
              <select
                className={`profile-select ${!isEditButtonPressed ? "cursor-not-allowed" : ""}`} /* ปรับจากเดิม */
                name="country"
                value={form.country}
                disabled={!isEditButtonPressed}
                onChange={(e) => {
                  const selectedCountry = e.target.value;
                  const tz =
                    countryTimezones.find((c) => c.country === selectedCountry)
                      ?.timezone || "";
                  setForm({ ...form, country: selectedCountry, timezone: tz });
                }}
              >
                <option value="">-- Select Country --</option>
                {countryTimezones.map((c) => (
                  <option key={c.country} value={c.country}>
                    {c.country}
                  </option>
                ))}
              </select>

              <label className="profile-label mb-2">Timezone</label> {/* ปรับจากเดิม */}
              <select
                className={`profile-select ${!isEditButtonPressed ? "cursor-not-allowed" : ""}`} /* ปรับจากเดิม */
                name="timezone"
                value={form.timezone}
                onChange={handleChange}
                disabled={!isEditButtonPressed}
              >
                <option value="">Select Timezone</option>
                {form.country &&
                  countryTimezones
                    .filter((c) => c.country === form.country)
                    .map((c) => (
                      <option key={c.timezone} value={c.timezone}>
                        {c.timezone}
                      </option>
                    ))}
              </select>

              <label className="profile-label mb-2">Phone Number</label> {/* ปรับจากเดิม */}
              <input
                name="phone"
                className={`profile-input ${!isEditButtonPressed ? "cursor-not-allowed" : ""}`} /* ปรับจากเดิม */
                placeholder="Your phone"
                value={form.phone}
                onChange={handleChange}
                disabled={!isEditButtonPressed}
              />
            </div>
          </div>

          {/* ปุ่ม Submit / Cancel */}
          {isEditButtonPressed && (
            <div className="flex gap-3 justify-end mt-4"> {/* ...existing code... */}
              <button
                className="profile-btn-cancel" /* ปรับจากเดิม */
                type="button"
                onClick={() => setIsEditButtonPressed(false)}
              >
                Cancel
              </button>
              <button
                className="profile-btn" /* ปรับจากเดิม */
                type="submit"
                onClick={handleSubmitForm}
              >
                Submit
              </button>
            </div>
          )}
        </form>
        <button
          onClick={() => setIsModalOpen(true)}
          className="profile-btn-logout" /* ปรับจากเดิม */
        >
          Logout
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <h2 className="profile-title mb-4">Confirm Logout</h2> {/* ปรับจากเดิม */}
        <p className="mb-6">Are you sure you want to logout?</p>
        <div className="flex justify-end gap-3"> {/* ...existing code... */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="profile-btn-cancel" /* ปรับจากเดิม */
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="profile-btn-logout" /* ปรับจากเดิม */
          >
            Confirm
          </button>
        </div>
      </Modal>
    </MainLayOut>
  );
}

export default Profile;
