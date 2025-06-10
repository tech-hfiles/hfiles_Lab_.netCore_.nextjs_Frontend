'use client'

import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AdminCreate, HfidCheck } from '@/services/labServiceApi'
import Home from '../components/Home'
import { toast, ToastContainer } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const AdminCreates = () => {
  const router = useRouter();
  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("emailId");
  const [userInfo, setUserInfo] = useState<{ username: string; userEmail: string; } | null>(null)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [isHFIDValid, setIsHFIDValid] = useState(false);
  const [checking, setChecking] = useState(false);

  const validateHFID = async (hfid: string) => {
    try {
      setChecking(true);
      const res = await HfidCheck({ hfid });
      setUserInfo({
        username: res.data.data.username,
        userEmail: res.data.data.userEmail
      })
      if (res?.data) {
        toast.success(`${res.data.message}`);
        setIsHFIDValid(true);
      } else {
        toast.error('Invalid HFID');
        setIsHFIDValid(false);
      }
    } catch (error) {
      const err = error as any;
      toast.error(`${err.res.data.message}`);
    } finally {
      setChecking(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      hfid: '',
      role: 'Super Admin',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      hfid: Yup.string().required('HFID is required'),
      role: Yup.string().required('Role is required'),
      password: Yup.string().required("Password is required").min(8, "Min 8 chars").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, "Must include upper, lower, number & special char"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          userId: Number(userId),
          email: email,
          hfid: values.hfid,
          role: values.role,
          password: values.password,
          confirmPassword: values.confirmPassword,
        };
        const response = await AdminCreate(payload);
        localStorage.setItem("authToken", response.data.data.token);
        localStorage.setItem("username", response.data.data.username);
        toast.success(`${response.data.message}`);
        router.push("/labHome");
        resetForm();
      } catch (error) {
        console.error(error);
        const err = error as any;
        toast.error(`${err.response.data.message}`);
      }
    },
  });

    // Step 1: Get token from localStorage
  const token = localStorage.getItem("authToken");

  if (token) {
    try {
      // Step 2: Decode the payload
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const data = JSON.parse(jsonPayload);
      localStorage.setItem("LabAdminId", data.LabAdminId);

    } catch (error) {
      console.error("Failed to decode JWT token:", error);
    }
  } else {
    console.log("No authToken found in localStorage.");
  }

  return (
    <Home>
      <div
        className="w-full flex  items-start justify-center lg:h-[calc(110vh-112px)] relative"
        style={{ background: 'linear-gradient(to bottom, white 70%, #67e8f9 100%)' }}
      >
        <div className="text-center relative z-10">
          {/* Header Section */}
          <div className="text-center my-6">
            <h2 className="text-2xl font-bold text-gray-900">
              <span className="text-red-600">Set Up </span>
              Your Super Admin Access
            </h2>
            <div className="w-32 h-[2px] bg-gray-500 border-b mx-auto mt-2"></div>

            <p className="text-sm text-black mt-4 max-w-xl mx-auto">
              You're the first to log in – to ensure secure access and accountability, please<br />
              verify your HF ID and create your login password.
            </p>
          </div>

          {/* HFID Check Section */}
          <div className="bg-white rounded-lg border shadow-lg p-6 max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Welcome to <span className="text-blue-700">HFiles!</span></h3>
            <div className="w-26 h-[2px] bg-gray-500 border-b mx-auto mt-2 mb-4"></div>
            <div className="space-y-4">
              <input
                type="text"
                name="hfid"
                placeholder="Enter your HF_ID"
                value={formik.values.hfid}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isHFIDValid}
              />
              {formik.touched.hfid && formik.errors.hfid && (
                <div className="text-red-500 text-sm">{formik.errors.hfid}</div>
              )}
              {!isHFIDValid && (
                <button
                  type="button"
                  onClick={() => validateHFID(formik.values.hfid)}
                  className="w-full bg-yellow-300 border text-black font-semibold py-2 rounded-lg hover:bg-yellow-500 transition"
                  disabled={checking}
                >
                  {checking ? 'Checking...' : 'Verify HF_ID'}
                </button>
              )}
            </div>
            {/* Admin Form Section */}
            {isHFIDValid && (
              <div className="space-y-6 mt-6">
                {/* User Profile Card */}
                <div className="bg-blue-50 rounded-lg p-4 flex items-center border border-gray-300">
                  <div className="w-12 h-12 bg-#CAE5FF rounded-full border overflow-hidden mr-4">
                    <img
                      src="/3d77b13a07b3de61003c22d15543e99c9e08b69b.jpg"
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/48')}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h2 className="text-black font-semibold">{userInfo?.username || 'Not Found'}</h2>
                    <p className="text-black">{userInfo?.userEmail || 'Not Found'}</p>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEye : faEyeSlash}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-sm">{formik.errors.password}</div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="relative mt-4">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full border p-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEye : faEyeSlash}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="text-red-500 text-sm">{formik.errors.confirmPassword}</div>
                  )}
                </div>

                <button
                  type="button"
                  className="w-full text-white font-semibold py-3 rounded-lg  transition primary cursor-pointer"
                  onClick={() => formik.handleSubmit()}
                >
                  Log In
                </button>
              </div>
            )}
          </div>
        </div>
        <ToastContainer />

        {/* Illustration (Background Image) */}
        <div
          className="fixed right-6 bottom-12 bg-cover bg-center opacity-50 flex justify-end w-[255px] h-[268px]"
          style={{ backgroundImage: 'url(/f02ab4b2b4aeffe41f18ff4ece3c64bd20e9a0f4.png)' }}
        ></div>
      </div>
    </Home>
  );
};

export default AdminCreates;
