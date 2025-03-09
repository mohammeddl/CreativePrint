import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const DebugInfo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, isAuthenticated, token, role, userId } = useSelector(
    (state: RootState) => state.user
  );
  const { profile, loading, error } = useSelector(
    (state: RootState) => state.userProfile
  );
  const [apiTest, setApiTest] = useState<{ status: string; message: string }>({
    status: "Not tested",
    message: "",
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  // Environment info
  const apiUrl = import.meta.env.VITE_API_URL || "Not set";

  // Local storage check
  const userFromLocalStorage = localStorage.getItem("user-current");
  const tokenFromLocalStorage = localStorage.getItem("token");

  const toggleDebug = () => setIsOpen(!isOpen);

  const toggleSection = (section: string) => {
    if (expanded === section) {
      setExpanded(null);
    } else {
      setExpanded(section);
    }
  };

  // Test an API call to see if authentication is working
  const testApi = async () => {
    setApiTest({ status: "Testing...", message: "" });

    try {
      // Parse user data to get the ID
      const userData = userFromLocalStorage
        ? JSON.parse(userFromLocalStorage)
        : null;
      const actualUserId =
        userId ||
        (userData ? userData.userId : null) ||
        (currentUser ? currentUser.id : null);

      if (!actualUserId) {
        setApiTest({
          status: "Failed",
          message: "No user ID available to test with",
        });
        return;
      }

      // Attempt to make an API call using fetch directly
      const response = await fetch(
        `${
          apiUrl || "http://localhost:1010/api"
        }/users/${actualUserId}/profile`,
        {
          headers: {
            Authorization: `Bearer ${tokenFromLocalStorage || token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setApiTest({
          status: "Success",
          message: `API call succeeded with status ${
            response.status
          }. Data: ${JSON.stringify(data).substring(0, 100)}...`,
        });
      } else {
        const text = await response.text();
        setApiTest({
          status: "Failed",
          message: `API call failed with status ${response.status}. Response: ${text}`,
        });
      }
    } catch (err: any) {
      setApiTest({
        status: "Error",
        message: `Exception during API call: ${err.message}`,
      });
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleDebug}
        className='fixed bottom-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md text-xs'>
        Debug
      </button>
    );
  }

  return (
    <div className='fixed bottom-4 left-4 z-50 p-4 bg-gray-900 text-white rounded-md max-w-md max-h-96 overflow-auto shadow-lg text-xs'>
      <div className='flex justify-between mb-2'>
        <h3 className='font-bold'>Debug Information</h3>
        <button
          onClick={toggleDebug}
          className='text-gray-400 hover:text-white'>
          Close
        </button>
      </div>

      <div className='mb-3'>
        <h4
          className='font-semibold border-b border-gray-700 pb-1 mb-1 cursor-pointer flex justify-between'
          onClick={() => toggleSection("env")}>
          Environment {expanded === "env" ? "▲" : "▼"}
        </h4>
        {expanded === "env" && (
          <div>
            <div>API URL: {apiUrl}</div>
            <div className='mt-2'>
              <button
                onClick={testApi}
                className='bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs'>
                Test API Connection
              </button>
              <div className='mt-1'>
                <span className='font-bold'>Status:</span> {apiTest.status}
              </div>
              {apiTest.message && (
                <div className='mt-1 text-xs break-words'>
                  <span className='font-bold'>Message:</span> {apiTest.message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className='mb-3'>
        <h4
          className='font-semibold border-b border-gray-700 pb-1 mb-1 cursor-pointer flex justify-between'
          onClick={() => toggleSection("auth")}>
          Auth State {expanded === "auth" ? "▲" : "▼"}
        </h4>
        {expanded === "auth" && (
          <div>
            <div>
              Is Authenticated (Redux): {isAuthenticated ? "Yes" : "No"}
            </div>
            <div>
              Is Authenticated (localStorage):{" "}
              {tokenFromLocalStorage ? "Yes" : "No"}
            </div>
            <div>User ID: {userId || "Not set"}</div>
            <div>Role: {role || "Not set"}</div>
            <div>Token in Redux: {token ? "Yes" : "No"}</div>
            <div>
              Token in localStorage: {tokenFromLocalStorage ? "Yes" : "No"}
            </div>
          </div>
        )}
      </div>

      <div className='mb-3'>
        <h4
          className='font-semibold border-b border-gray-700 pb-1 mb-1 cursor-pointer flex justify-between'
          onClick={() => toggleSection("user")}>
          User Data {expanded === "user" ? "▲" : "▼"}
        </h4>
        {expanded === "user" && (
          <div>
            {currentUser ? (
              <pre className='whitespace-pre-wrap'>
                {JSON.stringify(currentUser, null, 2)}
              </pre>
            ) : (
              <div>No user data in Redux state</div>
            )}
          </div>
        )}
      </div>

      <div className='mb-3'>
        <h4
          className='font-semibold border-b border-gray-700 pb-1 mb-1 cursor-pointer flex justify-between'
          onClick={() => toggleSection("profile")}>
          Profile State {expanded === "profile" ? "▲" : "▼"}
        </h4>
        {expanded === "profile" && (
          <div>
            <div>Loading: {loading ? "Yes" : "No"}</div>
            <div>Error: {error || "None"}</div>
            {profile ? (
              <pre className='whitespace-pre-wrap'>
                {JSON.stringify(profile, null, 2)}
              </pre>
            ) : (
              <div>No profile data in state</div>
            )}
          </div>
        )}
      </div>

      <div className='mb-3'>
        <h4
          className='font-semibold border-b border-gray-700 pb-1 mb-1 cursor-pointer flex justify-between'
          onClick={() => toggleSection("localStorage")}>
          Local Storage {expanded === "localStorage" ? "▲" : "▼"}
        </h4>
        {expanded === "localStorage" && (
          <div>
            <div>Token: {tokenFromLocalStorage ? "Present" : "Not found"}</div>
            <div>
              User Data: {userFromLocalStorage ? "Present" : "Not found"}
            </div>
            {userFromLocalStorage && (
              <pre className='whitespace-pre-wrap'>
                {JSON.stringify(JSON.parse(userFromLocalStorage), null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugInfo;
