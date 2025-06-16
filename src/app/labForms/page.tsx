"use client";
import React, { useRef, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { AddLabUserReport } from "@/services/labServiceApi";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Tooltip from "../components/Tooltip";
import Drawer from "../components/Drawer";
import FormInformation from "../components/pageInfomations/FormInformation";


interface FileWithReport {
  file: File;
  Id: string;
  Name: string;
  preview: string;
}

interface Patient {
  hfId: string;
  email: string;
  patientName: string;
  currentReportType: string;
  files: FileWithReport[];
}

interface FormValues {
  patients: Patient[];
}

interface ApiPayload {
  hfid: string;
  email: string;
  name: string;
  reportType: string;
  reportFiles: string[];
}

const reportTypes = [
  { Id: 3, Name: "LAB REPORT" },
  { Id: 4, Name: "DENTAL REPORT" },
  { Id: 5, Name: "IMMUNIZATION" },
  { Id: 6, Name: "MEDICATIONS/PRESCRIPTION" },
  { Id: 7, Name: "RADIOLOGY" },
  { Id: 8, Name: "OPTHALMOLOGY" },
  { Id: 9, Name: "SPECIAL REPORT" },
  { Id: 10, Name: "INVOICES/MEDICLAIM INSURANCE" },
];

const fileWithReportSchema = Yup.object().shape({
  file: Yup.mixed().required(),
  Id: Yup.string().required("Report type is required for each file"),
  Name: Yup.string(),
  preview: Yup.string(),
});

const patientSchema = Yup.object().shape({
  hfId: Yup.string().required("HF ID is required"),
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    )
    .required("Email is required"),
  patientName: Yup.string().required("Patient name is required"),
  currentReportType: Yup.string().required("Report type is required"),
  files: Yup.array()
    .of(fileWithReportSchema)
    .min(1, "At least one file is required with report type"),
});

const validationSchema = Yup.object().shape({
  patients: Yup.array().of(patientSchema),
});

const HTransferPage: React.FC = () => {
  const router = useRouter();
  const [forms, setForms] = useState<Patient[]>([
    {
      hfId: "",
      email: "",
      patientName: "",
      currentReportType: "",
      files: [],
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const userId = localStorage.getItem("userId");
  const isSwitched = localStorage.getItem("switch") === "true";

  const transformPayload = (patients: Patient[]) => {
    const formData = new FormData();



    patients.forEach((patient, index) => {
      formData.append(`Entries[${index}].HFID`, patient.hfId);
      formData.append(`Entries[${index}].Email`, patient.email);
      formData.append(`Entries[${index}].Name`, patient.patientName);

      const branchId = isSwitched && userId ? userId : "0";
      formData.append(`Entries[${index}].BranchId`, branchId);

      const uniqueReportNames = new Set<string>();
      patient.files.forEach((fileObj) => {
        uniqueReportNames.add(fileObj.Name);
      });

      Array.from(uniqueReportNames).forEach((name, i) => {
        formData.append(`Entries[${index}].ReportTypes[${i}]`, name);
      });

      patient.files.forEach((fileObj, fileIndex) => {
        formData.append(
          `Entries[${index}].ReportFiles`,
          fileObj.file,
          fileObj.file.name
        );
      });
    });

    return formData;
  };



  const formik = useFormik<FormValues>({
    initialValues: {
      patients: forms,
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      try {
        console.log("Submitted Data:", values.patients);
        const apiPayload = transformPayload(values.patients);
        const response = await AddLabUserReport(apiPayload);
        toast.success(`${response.data.message}`)
        setSubmitSuccess(true);
        setSubmitError(null);
        actions.resetForm();
        router.push("/labHome");
      } catch (error) {
        console.error("Failed to submit lab user report:", error);
        setSubmitError("Failed to submit reports. Please try again.");
        setSubmitSuccess(false);
      }
    },
    enableReinitialize: true,
  });


  const addForm = () => {
    const newForm: Patient = {
      hfId: "",
      email: "",
      patientName: "",
      currentReportType: "",
      files: [],
    };
    const updatedForms = [...formik.values.patients, newForm];
    setForms(updatedForms);
    formik.setFieldValue("patients", updatedForms);
  };

  const removeForm = (index: number) => {
    const updatedForms = [...formik.values.patients];
    updatedForms.splice(index, 1);
    setForms(updatedForms);
    formik.setFieldValue("patients", updatedForms);
  };

  const handleChange = (
    index: number,
    field: keyof Patient,
    value: any,
    additionalData?: any
  ) => {
    const updatedForms = [...formik.values.patients];

    if (field === "files" && Array.isArray(value)) {
      const { Id, Name } = additionalData;

      const newFiles: FileWithReport[] = value.map((file: File) => ({
        file,
        Id,
        Name,
        preview: URL.createObjectURL(file),
      }));

      updatedForms[index].files = [...updatedForms[index].files, ...newFiles];
    } else {
      updatedForms[index][field] = value;
    }

    setForms(updatedForms);
    formik.setFieldValue("patients", updatedForms);
  };

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const triggerFileSelect = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

 const resetFilter = (index: number) => {
  handleChange(index, "currentReportType", "");
  formik.setFieldTouched(`patients.${index}.currentReportType`, true);
};


  return (
    <DefaultLayout>
      {/* H-Transfer Form with responsive styling for small and medium screens */}
      <form onSubmit={formik.handleSubmit} className="p-4 space-y-6">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold text-black flex justify-center">
            <span className="text-blue-700">H-Transfer:</span>&nbsp;Instant
            Health Delivery
          </h1>
          <div className="w-full max-w-md border-b-2 border-black mt-2"></div>

          {/* Info Icon */}
          <div className="absolute right-0 ml-2 bg-green-700 text-white rounded-sm w-8 h-8 flex items-center justify-center cursor-pointer">
            <Tooltip content="Information about this page" position="bottom right-2">
              <FontAwesomeIcon icon={faInfoCircle} onClick={() => setIsDrawerOpen(true)} />
            </Tooltip>
          </div>


          <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
            <FormInformation />
          </Drawer>
        </div>

        {submitSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">Reports submitted successfully!</span>
          </div>
        )}

        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{submitError}</span>
          </div>
        )}

        {formik.values.patients.map((form, index) => {
          const errors =
            (formik.errors.patients?.[index] as Partial<
              Record<keyof Patient, string>
            >) || {};
          const touched =
            (formik.touched.patients?.[index] as Partial<
              Record<keyof Patient, boolean>
            >) || {};

          return (
            <div key={index} className="mb-6 p-2 md:p-4 relative">
              <button
                type="button"
                className="absolute -top-7 -left-1 md:-left-3 text-black p-2 md:p-3 mt-9"
                onClick={addForm}
              >
                <Tooltip content="Added Multiple form" position="bottom left-2">
                <FontAwesomeIcon icon={faCirclePlus} size="lg" />
                </Tooltip >
              </button>

              {formik.values.patients.length > 1 && (
                <button
                  type="button"
                  className="absolute -top-7 right-0 text-red-600 p-2 md:p-3 mt-9"
                  onClick={() => removeForm(index)}
                  title="Remove form"
                >
                  <FontAwesomeIcon icon={faCircleXmark} size="lg" />
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-2 md:mb-4 mx-1 md:mx-8 px-1 md:px-8">
                <div>
                  <input
                    type="text"
                    placeholder="Enter HF id."
                    value={form.hfId}
                    onChange={(e) =>
                      handleChange(index, "hfId", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded-md w-full"
                    onBlur={() =>
                      formik.setFieldTouched(`patients.${index}.hfId`, true)
                    }
                  />
                  {touched.hfId && errors.hfId && (
                    <p className="text-red-500 text-sm mt-1">{errors.hfId}</p>
                  )}
                </div>

                <div className="mt-2 md:mt-0">
                  <input
                    type="email"
                    placeholder="Enter email id."
                    value={form.email}
                    onChange={(e) =>
                      handleChange(index, "email", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded-md w-full"
                    onBlur={() =>
                      formik.setFieldTouched(`patients.${index}.email`, true)
                    }
                  />
                  {touched.email && errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 mb-2 md:mb-4 mx-1 md:mx-8 px-1 md:px-8">
                <div>
                  <input
                    type="text"
                    placeholder="Enter Patient Name"
                    value={form.patientName}
                    onChange={(e) =>
                      handleChange(index, "patientName", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded-md w-full"
                    onBlur={() =>
                      formik.setFieldTouched(
                        `patients.${index}.patientName`,
                        true
                      )
                    }
                  />
                  {touched.patientName && errors.patientName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.patientName}
                    </p>
                  )}
                </div>

                <div className="mt-2 md:mt-0">
                  <select
                    value={form.currentReportType}
                    onChange={(e) =>
                      handleChange(index, "currentReportType", e.target.value)
                    }
                    className="border border-gray-300 p-2 rounded-md w-full"
                    onBlur={() =>
                      formik.setFieldTouched(
                        `patients.${index}.currentReportType`,
                        true
                      )
                    }
                  >
                    <option value="">Select report type...</option>
                    {reportTypes.map((type) => (
                      <option
                        key={type.Id}
                        value={type.Id.toString()}
                      >
                        {type.Name}
                      </option>
                    ))}
                  </select>
                  {touched.currentReportType && errors.currentReportType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.currentReportType}
                    </p>
                  )}
                </div>

                <div className="flex mt-3 md:mt-0">
                  <input
                    type="file"
                    accept="image/*,application/pdf,application/zip,application/x-zip-compressed"
                    multiple
                    ref={(el) => {
                      fileInputRefs.current[index] = el;
                    }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        if (!form.currentReportType) {
                          alert(
                            "Please select a report type before uploading files."
                          );
                          e.target.value = "";
                          return;
                        }
                        const newFilesArray = Array.from(e.target.files);

                        const selectedReport = reportTypes.find(
                          (type) =>
                            type.Id.toString() === form.currentReportType
                        );

                        handleChange(index, "files", newFilesArray, {
                          Id: form.currentReportType,
                          Name: selectedReport?.Name || "Unknown",
                        });
                        formik.setFieldTouched(
                          `patients.${index}.files`,
                          true,
                          false
                        );
                        e.target.value = "";
                      }
                    }}
                    className="hidden"
                  />
                  <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => triggerFileSelect(index)}
                    disabled={!form.currentReportType}
                    className={`px-6 py-2 rounded-md w-full sm:w-auto ${
                      form.currentReportType
                        ? "primary text-white hover:bg-blue-800"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Upload
                  </button>
            <Tooltip content="Added Multiple report" position="bottom right-2">

                  <button
                    type="button"
                    onClick={() => resetFilter(index)}
                    disabled={!form.currentReportType}
                    className={`px-6 py-2 rounded-md w-full sm:w-auto ${
                      form.currentReportType
                        ? "primary text-white hover:bg-blue-800"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Add
                  </button>
                  </Tooltip >
                </div>
                </div>

                {touched.files && errors.files && (
                  <p className="text-red-500 text-sm mt-1">{errors.files}</p>
                )}

              </div>

              {form.files.length > 0 && (
                <div className="mt-4 px-2 md:px-8 mx-1 md:mx-8">
                  <p className="text-gray-700 font-medium mb-1">
                    Ready to send:{" "}
                    <span className="text-red-600 font-medium">
                      You have to access the multiple report type select and file upload
                    </span>
                  </p>
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex flex-wrap gap-2 md:gap-4 mt-2">
                      {form.files.map((fileObj, i) => (
                        <div key={i} className="relative">
                          <div className="border border-gray-300 rounded w-24 md:w-32 h-24 md:h-32 flex flex-col items-center">
                            <div className="w-full h-16 md:h-24 border-b border-gray-300 p-1 md:p-2 flex items-center justify-center">
                              {fileObj.file.type === "application/pdf" ? (
                                <span className="text-xs text-gray-600">
                                  PDF File
                                </span>
                              ) : (
                                <img
                                  src={fileObj.preview}
                                  alt={`Preview ${i}`}
                                  className="max-w-full max-h-full object-contain"
                                />
                              )}
                            </div>
                            <div className="text-xs text-center p-1 w-full text-blue-700 font-medium truncate">
                              {fileObj.Name}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="absolute -top-2 -right-2 text-red-600 bg-white rounded-full"
                            onClick={() => {
                              const updatedPatients = [...formik.values.patients];
                              const updatedFiles = [...updatedPatients[index].files];
                              updatedFiles.splice(i, 1);
                              updatedPatients[index].files = updatedFiles;

                              setForms(updatedPatients); 
                              formik.setFieldValue("patients", updatedPatients); 
                            }}

                            title="Remove file"
                          >
                            <FontAwesomeIcon icon={faCircleXmark} size="lg" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div className="w-full border-b border-black mt-4 md:mt-6"></div>
            </div>
          );
        })}

        <div className="flex flex-col sm:flex-row justify-between items-center px-2 md:px-8 py-4 border-t z-10 gap-3">
          <div className="bg-green-700 text-white rounded-lg py-2 px-4 text-center sm:text-left">
            Let's turn those reports into a health success story!
          </div>
          <div className="w-full sm:w-auto">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${isSubmitting ? "bg-gray-500" : "primary hover:bg-blue-800"
                } text-white px-6 py-2 rounded-md w-full sm:w-auto cursor-pointer`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
        <ToastContainer />
      </form>
    </DefaultLayout>
  );
};

export default HTransferPage;