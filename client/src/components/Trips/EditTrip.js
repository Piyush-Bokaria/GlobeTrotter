import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const EditTrip = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    destination: "",
  });
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [currentCoverPhoto, setCurrentCoverPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  const fetchTrip = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/apis/trips/${tripId}`
      );

      if (response.ok) {
        const data = await response.json();
        const trip = data.trip;

        setFormData({
          name: trip.name || "",
          description: trip.description || "",
          startDate: trip.startDate
            ? new Date(trip.startDate).toISOString().split("T")[0]
            : "",
          endDate: trip.endDate
            ? new Date(trip.endDate).toISOString().split("T")[0]
            : "",
          budget: trip.budget || "",
          destination: trip.destination || "",
        });

        if (trip.coverPhoto) {
          setCurrentCoverPhoto(trip.coverPhoto);
        }
      } else {
        setError("Failed to load trip details");
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
      setError("Failed to load trip details");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setCoverPhoto(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setCoverPhoto(null);
    setCoverPhotoPreview(null);
    setCurrentCoverPhoto(null);
    // Reset file input
    const fileInput = document.getElementById("coverPhoto");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validation
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.startDate ||
      !formData.endDate
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Date validation
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (endDate <= startDate) {
      setError("End date must be after start date");
      setLoading(false);
      return;
    }

    try {
      // Convert photo to base64 if exists
      let photoData = currentCoverPhoto; // Keep existing photo by default
      if (coverPhoto) {
        const reader = new FileReader();
        photoData = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(coverPhoto);
        });
      }

      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to edit trips.");
        setLoading(false);
        return;
      }

      const tripData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
        destination: formData.destination.trim(),
        coverPhoto: photoData,
        // No need to send userId - it will be extracted from JWT token
      };

      console.log("Sending update trip request:", tripData);

      const response = await fetch(
        `http://localhost:5000/apis/trips/${tripId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Send JWT token
          },
          body: JSON.stringify(tripData),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error response:", errorText);
        try {
          const errorData = JSON.parse(errorText);
          setError(errorData.message || "Failed to update trip");
        } catch {
          setError(`Server error: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      console.log("Success response:", data);

      setMessage(data.message);

      // Redirect to trips list after successful update
      setTimeout(() => {
        navigate("/trips");
      }, 2000);
    } catch (error) {
      console.error("Network error:", error);
      setError(
        `Network error: ${error.message}. Make sure the server is running.`
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/dashboard"
                className="text-xl font-semibold text-gray-900"
              >
                GlobeTrotter
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/trips"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                My Trips
              </Link>
              <Link
                to="/profile"
                className="flex items-center text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <Link
                  to="/trips"
                  className="mr-4 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Edit Trip</h1>
              </div>
              <p className="mt-2 text-gray-600">
                Update your trip details and make changes as needed.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trip Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Trip Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Summer Europe Adventure"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Destination */}
              <div>
                <label
                  htmlFor="destination"
                  className="block text-sm font-medium text-gray-700"
                >
                  Destination
                </label>
                <input
                  id="destination"
                  name="destination"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Paris, France"
                  value={formData.destination}
                  onChange={handleChange}
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date *
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date *
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Budget */}
              <div>
                <label
                  htmlFor="budget"
                  className="block text-sm font-medium text-gray-700"
                >
                  Budget (Optional)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    id="budget"
                    name="budget"
                    type="number"
                    min="0"
                    step="0.01"
                    className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="0.00"
                    value={formData.budget}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Trip Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Describe your trip plans, activities, or any special notes..."
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Cover Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cover Photo (Optional)
                </label>
                <div className="mt-1">
                  {coverPhotoPreview || currentCoverPhoto ? (
                    <div className="relative">
                      <img
                        src={coverPhotoPreview || currentCoverPhoto}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="coverPhoto"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="coverPhoto"
                              name="coverPhoto"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error and Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Link
                  to="/trips"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating Trip..." : "Update Trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditTrip;
