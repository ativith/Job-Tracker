import React, { useContext, useState, useEffect } from "react";
import MainLayOut from "../layouts/MainLayOut";
import Modal from "../components/ModalScreen";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";

import DetailCard from "../components/DetailCard";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

type Status = "applied" | "interview" | "offer" | "rejected" | "noresponse";

type Replied = "Yes" | "No";
interface JobForm {
  title: string;
  company: string;
  status: Status;
  date: Dayjs | null;
  replied: Replied;
  tags: string;
  note: string;
}
type Job = {
  id: number;
  title: string;
  company: string;
  date: string;
  status: "applied" | "interview" | "offer" | "rejected" | "noresponse";
  replied: string;
  tags: string;
  note: string;
};
function Application() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("applied");
  const [tagsFilter, setTagFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<JobForm>({
    title: "",
    company: "",
    status: "applied",
    date: dayjs(),
    replied: "Yes",
    tags: "",
    note: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [editJobId, setEditJobId] = useState<number | null>(null);
  const fetchJobs = async (): Promise<Job[]> => {
    const response = await axiosInstance.get(API_PATH.JOBS.GETJOBS);

    return response.data.jobs;
  };

  const {
    data: jobs = [],
    isLoading,
    error,
  } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });

  const allTags = Array.from(
    new Set(
      jobs
        .map((job) => job.tags) // เอาแต่ tags
        .filter(Boolean) // ตัดค่า empty string / null
        .flatMap((tag) => tag.split(",").map((t) => t.trim())) // ถ้า tag เป็น comma-separated
    )
  );

  const addJobMutation = useMutation({
    mutationFn: (newJob: Partial<Job>) =>
      axiosInstance.post(API_PATH.JOBS.ADDNEWJOBS, newJob),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });

  const updateJobMutation = useMutation({
    mutationFn: (job: Job) =>
      axiosInstance.put(API_PATH.JOBS.UPDATEJOBS(job.id), job),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id: number) =>
      axiosInstance.post(API_PATH.JOBS.DELETEJOBS(id), { jobId: id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to fetch jobs</p>;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setForm({ ...form, date: newValue });
  };
  const handleRemoveJob = async (id: number) => {
    deleteJobMutation.mutate(id);
  };
  const handleUpdateJob = async (id: number, job: Partial<Job>) => {
    setForm({
      title: job.title ?? "",
      company: job.company ?? "",
      status: job.status ?? "applied",
      date: dayjs(job.date), // สมมติ backend ส่งเป็น string
      replied: job.replied as Replied,
      tags: job.tags ?? "",
      note: job.note ?? "",
    });
    setEditJobId(id);
    setIsModalOpen(true);
  };

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!form.title) newErrors.title = "Title is required";
    if (!form.company) newErrors.company = "Company is required";
    if (!form.status) newErrors.status = "Status is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.replied) newErrors.replied = "Replied is required";
    if (!form.tags) newErrors.tags = "Tags is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      if (editJobId === null) {
        addJobMutation.mutate({ ...form, date: form.date?.toISOString() });
      } else {
        updateJobMutation.mutate({
          id: editJobId,
          ...form,
          date: form.date?.toISOString() || "",
        } as Job);
      }

      setForm({
        title: "",
        company: "",
        status: "applied",
        date: dayjs(),
        replied: "Yes",
        tags: "",
        note: "",
      });
      console.log("here");
      setEditJobId(null);
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <MainLayOut>
      <div>
        <div className="flex flex-1 justify-between flex-wrap mb-3 ">
          <div className="flex flex-1 gap-3 flex-wrap">
            <input
              value={search}
              placeholder="Search by title,company"
              className="border-2 rounded-sm p-2"
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={statusFilter}
              className="border-2 rounded-sm"
              onChange={(e) => setStatusFilter(e.target.value as Status)}
            >
              <option value="all">All</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
              <option value="noresponse">No Response</option>
            </select>
            <select
              value={tagsFilter}
              className="border-2 rounded-sm"
              onChange={(e) => setTagFilter(e.target.value)}
            >
              <option value="all">All Tags</option>
              {...allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-sm border-0 p-2 bg-green-400 ">
            <button
              className="text-white font-bold "
              type="button"
              onClick={() => {
                setEditJobId(null);
                setForm({
                  title: "",
                  company: "",
                  status: "applied",
                  date: dayjs(),
                  replied: "Yes",
                  tags: "",
                  note: "",
                });
                setIsModalOpen(true);
              }}
            >
              + New
            </button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <form onSubmit={submitForm} className="flex flex-col gap-4">
                <h2>New Job</h2>

                {/* Title */}
                <div>
                  <label className="block mt-1">Title</label>
                  <input
                    name="title"
                    value={form.title}
                    className="rounded-sm p-2 border-2 w-full"
                    onChange={handleChange}
                    required
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <label className="block mt-1">Company</label>
                  <input
                    name="company"
                    value={form.company}
                    className="rounded-sm p-2 border-2 w-full"
                    onChange={handleChange}
                    required
                  />
                  {errors.company && (
                    <p className="text-red-500 text-sm">{errors.company}</p>
                  )}
                </div>

                {/* Status, Date, Replied */}
                <div className="flex gap-4 mt-5 items-end">
                  <div className="flex flex-col w-40">
                    <label>Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="rounded-sm border-2 p-2"
                      required
                    >
                      <option value="applied">Applied</option>
                      <option value="interview">Interview</option>
                      <option value="offer">Offer</option>
                      <option value="rejected">Rejected</option>
                      <option value="noresponse">No Response</option>
                    </select>
                    {errors.status && (
                      <p className="text-red-500 text-sm">{errors.status}</p>
                    )}
                  </div>

                  <div className="flex flex-col w-40">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date"
                        value={form.date}
                        onChange={handleDateChange}
                      />
                    </LocalizationProvider>
                  </div>

                  <div className="flex flex-col w-40">
                    <label>Replied</label>
                    <select
                      name="replied"
                      value={form.replied}
                      onChange={handleChange}
                      className="rounded-sm border-2 p-2"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block mb-1">Tags</label>
                  <input
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="Enter new tag"
                    className="rounded-sm border-2 p-2 w-full"
                  />
                  {errors.tags && (
                    <p className="text-red-500 text-sm">{errors.tags}</p>
                  )}
                </div>

                {/* Note */}
                <div>
                  <label className="block mb-1">Note</label>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    className="rounded-sm border-2 p-2 w-full"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    className="rounded-sm p-2 font-bold text-black border-1"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditJobId(null);
                      setForm({
                        title: "",
                        company: "",
                        status: "applied",
                        date: dayjs(),
                        replied: "Yes",
                        tags: "",
                        note: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-sm p-2 font-bold text-black bg-green-400"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </Modal>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 ">
          {" "}
          {jobs
            .filter(
              (job) =>
                job.title.toLowerCase().includes(search.toLowerCase()) ||
                job.company.toLowerCase().includes(search.toLowerCase())
            )
            .filter(
              (job) => statusFilter === "all" || job.status === statusFilter
            )
            .filter((job) =>
              tagsFilter === "" || tagsFilter === "all"
                ? true
                : job.tags
                    .split(",")
                    .map((t) => t.trim())
                    .includes(tagsFilter)
            )

            .map((job) => (
              <DetailCard
                key={job.id}
                company={job.company}
                role={job.title}
                date={job.date}
                status={job.status}
              >
                <div className="flex flex-1 justify-between mt-2">
                  <div className="px-3 py-1 rounded-full text-sm sm:text-base font-semibold shadow-sm text-center  bg-sky-300">
                    {job.tags}
                  </div>

                  <div>
                    <button
                      className="rounded-sm border-1 px-2 mx-2"
                      onClick={() => handleUpdateJob(job.id, job)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-sm border-1 border-red-500 px-2 text-red-600"
                      onClick={() => handleRemoveJob(job.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </DetailCard>
            ))}
        </div>
      </div>
    </MainLayOut>
  );
}

export default Application;
