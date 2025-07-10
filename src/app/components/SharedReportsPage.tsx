"use client";
import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { ListReport, ResendReport } from "@/services/labServiceApi";
import { useSearchParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import Tooltip from "../components/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import Drawer from "../components/Drawer";
import ShareReportInformation from "../components/pageInfomations/ShareReportInformation";



const reportTypes = [
  { Id: 3, Name: "Lab Report" },
  { Id: 4, Name: "Dental Report" },
  { Id: 5, Name: "Immunization" },
  { Id: 6, Name: "Medications/Prescription" },
  { Id: 7, Name: "Radiology" },
  { Id: 8, Name: "Ophthalmology" },
  { Id: 9, Name: "Special Report" },
  { Id: 10, Name: "Invoices/Mediclaim Insurance" },
];

const SharedReportsPage = () => {
  const [isResendMode, setIsResendMode] = useState(false);
  const [reportslist, setReportsList] = useState<any[]>([]);
  const [userDetail, setUserdetail] = useState<any>({});
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [selected, setSelected] = useState("All Reports");
  const [searchQuery, setSearchQuery] = useState("");
  const [reportsCount, setReportCount] = useState() as any;
 const [isDrawerOpen, setIsDrawerOpen] = useState(false);
 

  const BASE_URL = "https://hfiles.in/upload/";

  

  // Base URL where your files are served from your .NET Core API's wwwroot/uploads folder
  const BASE_FILE_URL = "https://d7cop3y0lcg80.cloudfront.netreports/";

  const LabReportList = async () => {
    const filter = selected === "All Reports" ? "" : selected;
    const response = await ListReport(Number(userId), filter);
    setReportsList(response?.data?.data?.reports);
    setUserdetail(response?.data?.data?.userDetails);
    setReportCount(response?.data.data.reportCounts);
  };

  useEffect(() => {
    LabReportList();
  }, [selected]);

  const formik = useFormik({
    initialValues: {
      ids: [] as number[],
    },
    validationSchema: Yup.object({
      ids: Yup.array().min(1, "Please select at least one report."),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await ResendReport({ ids: values.ids });
        toast.success(`${res.data.message}`);
        resetForm();
        setIsResendMode(false);
        await LabReportList();
      } catch (error: any) {
        console.error("Failed to resend reports", error);
      }
    },
  });

  const filteredData = reportslist?.filter((report) =>
    report.reportType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.createdDate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.resendDate?.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (
    <DefaultLayout>
      <div className=" p-4">
        {/* Page Title */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="text-xl font-bold text-black mx-3">Profile:</div>
            <div className="relative w-full sm:w-auto mx-3">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-2 pr-10 py-1 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute right-0 top-0 text-white bg-black p-2 rounded-full hover:bg-gray-800 cursor-pointer"
              />
            </div>
          </div>
          <div className="border-b mx-3"></div>
        </div>
<div className="flex justify-between">
        <div className="bg-blue-100 rounded-xl flex flex-col sm:flex-row items-center max-w-sm border shadow-md overflow-hidden relative px-4 py-3">
          {/* HFID Badge */}
          <div className="absolute top-0 right-0 bg-white text-gray-800 text-xs font-semibold px-2 py-1 rounded-md shadow">
            {userDetail?.hfid}
          </div>

          {/* Profile Image */}
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow mx-auto sm:mx-0 sm:mr-4">
            <img
              src={
                userDetail.userImage && userDetail.userImage !== "No image preview available"
                  ? `${BASE_URL}${userDetail.userImage}`
                  : "/3d77b13a07b3de61003c22d15543e99c9e08b69b.jpg"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
            <h2 className="text-blue-800 text-lg font-bold">{userDetail.fullName}</h2>
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Email :</span> {userDetail.email}
            </p>
            {/* Total Reports */}
            <div className="text-right mt-2 sm:mt-0 sm:self-start sm:ml-auto">
              <p className="text-sm font-semibold text-gray-800">
                Total Reports : <span className="font-normal">{reportsCount}</span>
              </p>
            </div>
          </div>

        </div>
 {/* Info Icon */}
         <div className=" ml-2 bg-green-700 text-white rounded-sm w-8 h-8 flex items-center justify-center cursor-pointer">
            <Tooltip content="Information about this page" position="bottom right-2">
              <FontAwesomeIcon icon={faInfoCircle} onClick={() => setIsDrawerOpen(true)} />
            </Tooltip>
          </div>

           <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
             <ShareReportInformation />
           </Drawer>
           </div>

        <div className="text-right mt-2 sm:mt-0 sm:self-start sm:ml-auto mx-6">
          <p className="text-sm font-semibold text-gray-800">
            From : <span className="font-normal">{userDetail.firstSentReportDate}</span> , To : <span className="font-normal">{userDetail.lastSentReportDate}</span>
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="border border-black mt-4 rounded-xl">
            <div className="bg-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <p className="text-gray-700 mb-2 sm:mb-0">
                A complete history of all the reports you’ve shared with users.
              </p>

              <select
                className="border border-black bg-white rounded-md px-3 py-2 text-sm"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                <option>All Reports</option>
                {reportTypes.map((report) => (
                  <option key={report.Id} value={report.Name}>
                    {report.Name}
                  </option>
                ))}
              </select>
            </div>
            <div className="border"></div>
            {/* Group reports by createdDate */}
            {(() => {
              const groupedReports = filteredData.reduce(
                (acc: { [key: string]: any[] }, report) => {
                  const date = report.createdDate;
                  if (!acc[date]) acc[date] = [];
                  acc[date].push(report);
                  return acc;
                },
                {}
              );

              return Object.entries(groupedReports).map(([date, reports]) => {
                // Separate reports by branch
                const regularReports = reports.filter(report => report.branchName === report.labName);
                const mumbaiReports = reports.filter(report => report.branchName !== report.labName);

                return (

                  <div key={date} className="mb-6">

                    {/* Regular reports row */}
                    {regularReports.length > 0 && (
                      <div className="flex flex-wrap gap-4 mb-4 mt-3 mx-3">
                        {regularReports.slice(0, 8).map((report: any, index: number) => {
                          const id = report.labUserReportId;
                          const isChecked = formik.values.ids.includes(id);

                          return (
                            <div key={index} className="flex-shrink-0">
                              <div className="border border-gray-300 rounded w-32 h-32 flex flex-col items-center justify-center gap-2 mb-3 relative px-2">
                                {isResendMode && (
                                  <input
                                    type="checkbox"
                                    className="absolute bottom-2 right-2 w-4 h-4"
                                    checked={isChecked}
                                    onChange={() => {
                                      const newIds = isChecked
                                        ? formik.values.ids.filter((itemId) => itemId !== id)
                                        : [...formik.values.ids, id];
                                      formik.setFieldValue("ids", newIds);
                                    }}
                                  />
                                )}

                                {/* {report.fileURL?.toLowerCase().endsWith(".pdf") ? (
                                  <a
                                    href={`${report.fileURL}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    View PDF Report
                                  </a>
                                ) : (
                                  <img
                                    src={`${report.fileURL}`}
                                    alt="Report Thumbnail"
                                    className="w-32 h-32 object-contain"
                                  />
                                )} */}
                                {report.fileURL && (
  <div>
    <a
      href={report.fileURL}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      {(() => {
        const lowerUrl = report.fileURL.toLowerCase();
        if (lowerUrl.endsWith(".pdf")) {
          return "View PDF Report";
        } else if (
          lowerUrl.endsWith(".png") ||
          lowerUrl.endsWith(".jpg") ||
          lowerUrl.endsWith(".jpeg") ||
          lowerUrl.endsWith(".webp")
        ) {
          return (
            <img
              src={report.fileURL}
              alt="Report"
              className="w-32 h-32 object-contain"
            />
          );
        } else {
          return "Download File";
        }
      })()}
    </a>
  </div>
)}

                              </div>
                              <Tooltip content={report.reportType} position="left-3">
                                <p className="text-sm w-32 text-center whitespace-nowrap overflow-hidden text-ellipsis px-1">
                                  {report.reportType}
                                </p>
                              </Tooltip>
                              <div className="text-black text-sm">Resend : {report.resendDate}</div>

                            </div>
                          );
                        })}
                      </div>
                    )}
                    {mumbaiReports.length > 0 && (
                      <>
                        {/* Mumbai reports row */}
                        <div className="border mx-2 "></div>
                        <div className="flex flex-wrap gap-4 mb-4 mx-2 mt-3">
                          {mumbaiReports.slice(0, 8).map((report: any, index: number) => {
                            const id = report.labUserReportId;
                            const isChecked = formik.values.ids.includes(id);

                            return (
                              <div key={`mumbai-${index}`} className="flex-shrink-0">

                                <div className="border border-gray-300 rounded w-32 h-32 flex flex-col items-center justify-center gap-2 mb-3 relative px-2">
                                  {isResendMode && (
                                    <input
                                      type="checkbox"
                                      className="absolute bottom-2 right-2 w-4 h-4"
                                      checked={isChecked}
                                      onChange={() => {
                                        const newIds = isChecked
                                          ? formik.values.ids.filter((itemId) => itemId !== id)
                                          : [...formik.values.ids, id];
                                        formik.setFieldValue("ids", newIds);
                                      }}
                                    />
                                  )}

                                 {report.fileURL && (
  <div>
    <a
      href={report.fileURL}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      {(() => {
        const lowerUrl = report.fileURL.toLowerCase();
        if (lowerUrl.endsWith(".pdf")) {
          return "View PDF Report";
        } else if (
          lowerUrl.endsWith(".png") ||
          lowerUrl.endsWith(".jpg") ||
          lowerUrl.endsWith(".jpeg") ||
          lowerUrl.endsWith(".webp")
        ) {
          return (
            <img
              src={report.fileURL}
              alt="Report"
              className="w-32 h-32 object-contain"
            />
          );
        } else {
          return "Download File";
        }
      })()}
    </a>
  </div>
)}

                                </div>

                                <Tooltip content={report.reportType} position="left-3">
                                  <p className="text-sm w-32 text-center whitespace-nowrap overflow-hidden text-ellipsis px-1">
                                    {report.reportType}
                                  </p>
                                </Tooltip>

                              </div>
                            );
                          })}
                        </div>
                        {/* Mumbai branch notification */}
                        <div className="flex  mx-2 text-green-600">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-1">
                            <span className="text-white text-sm">✓</span>
                          </div>
                          <p className="text-sm">This report was sent by the Mumbai branch.</p>
                        </div>
                      </>
                    )}
                    <div className="flex justify-end mb-2 mx-3">
                      <p>{date}</p>
                    </div>
                    <div className="border mb-3 mx-3"></div>

                    {/* Mumbai branch reports - separate row with notification */}
                  </div>
                );
              });
            })()}
            {/* Resend & Submit Buttons */}
            <div className="flex justify-end mt-3 mb-3 mx-3 space-x-2">
              {isResendMode && (
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-2 rounded-sm cursor-pointer"
                >
                  Submit
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsResendMode(!isResendMode);
                  formik.resetForm();
                }}
                className={`${isResendMode
                    ? "bg-gray-400 hover:bg-gray-500 text-white"
                    : "bg-yellow-300 hover:bg-yellow-400 text-gray-800"
                  } font-semibold px-6 py-2 rounded-sm cursor-pointer`}
              >
                {isResendMode ? "Cancel" : "Resend"}
              </button>
            </div>
          </div>

          {/* Validation Message */}
          {formik.errors.ids && formik.touched.ids && (
            <div className="text-red-600 text-sm mt-2">{formik.errors.ids}</div>
          )}

        </form>
        <ToastContainer />
      </div>
    </DefaultLayout>
  );
};

export default SharedReportsPage;