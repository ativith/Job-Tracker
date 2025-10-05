import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import BigCard from "../components/ฺBigCard";
import DetailCard from "../components/DetailCard";
import MainLayOut from "../layouts/MainLayOut";
import { UserContext } from "../context/userContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";
import { useQuery } from "@tanstack/react-query";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import EventCard from "../components/EventCard";
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { FaFileAlt, FaUserCheck, FaGift, FaTimesCircle } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface BackendEvent {
  id: number;
  title: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  allDay: Boolean;
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

const fetchJobs = async (): Promise<Job[]> => {
  const response = await axiosInstance.get(API_PATH.JOBS.GETJOBS);

  return response.data.jobs;
};
const fetchEvents = async (): Promise<BackendEvent[]> => {
  const response = await axiosInstance.get<{ events: BackendEvent[] }>(
    API_PATH.EVENTS.GETEVENTS
  );
  return response.data.events;
};
function Dashboard() {
  const { user } = useContext(UserContext);
  const {
    data: jobs = [],
    isLoading: isJobLoading,
    error: jobError,
  } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });
  const {
    data: events = [],
    isLoading: isEventsLoading,
    error: eventError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
  if (isJobLoading || isEventsLoading) return <p>Loading...</p>;
  if (jobError || eventError) return <p>Failed to fetch data</p>;

  const offer = jobs.filter((j) => j.status === "offer").length;
  const rejected = jobs.filter((j) => j.status === "rejected").length;
  const Interviewed = jobs.filter((j) => j.status === "interview").length;

  const latestJobs = [...jobs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  const latestEvents = [...events]
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )
    .slice(0, 3);
  const chartData = {
    labels: ["Applied", "Interview", "Offer", "Rejected", "No-Response"],
    datasets: [
      {
        label: "# of Jobs",
        data: [
          jobs.filter((j) => j.status === "applied").length,
          jobs.filter((j) => j.status === "interview").length,
          jobs.filter((j) => j.status === "offer").length,
          jobs.filter((j) => j.status === "rejected").length,
          jobs.filter((j) => j.status === "noresponse").length,
        ],
        backgroundColor: [
          "#3B82F6", // 🔵 applied
          "#F59E0B", // 🟡 interview
          "#10B981", // 🟢 offer
          "#EF4444", // 🔴 rejected
          "#9CA3AF", //
        ],
        borderColor: ["#fff", "#fff", "#fff", "#fff", "#fff"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: { position: "bottom" as const },
      tooltip: { enabled: true },
      datalabels: {
        color: "#fff",
        font: { weight: "bold", size: 14 },
        formatter: (value: number, context: any) => {
          const dataset = context.chart.data.datasets[0].data;
          const total = dataset.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
      },
    },
    cutout: "0%",
  };

  return (
    <MainLayOut>
      {/* Overview cards */}
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800">
          Welcome, <span className="text-blue-500">{user?.username}</span>!
        </h2>
        <p className="text-gray-500 text-sm sm:text-base">
          Here's a quick overview of your dashboard.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <BigCard
            bgColor="#e0f2fe"
            className="transform transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex justify-center mb-2">
              <FaFileAlt className="text-blue-500 text-3xl" />
            </div>
            <h5 className="text-center text-black">Total Applications</h5>
            <h1 className="text-center text-black text-2xl font-bold">
              {jobs.length}
            </h1>
          </BigCard>

          <BigCard
            bgColor="#d1fae5"
            className="transform transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex justify-center mb-2">
              <FaUserCheck className="text-green-500 text-3xl" />
            </div>
            <h5 className="text-center text-black">Interviewed</h5>
            <h1 className="text-center text-black text-2xl font-bold">
              {Interviewed}
            </h1>
          </BigCard>

          <BigCard
            bgColor="#fef3c7"
            className="transform transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex justify-center mb-2">
              <FaGift className="text-yellow-500 text-3xl" />
            </div>
            <h5 className="text-center text-black">Offer Received</h5>
            <h1 className="text-center text-black text-2xl font-bold">
              {offer}
            </h1>
          </BigCard>

          <BigCard
            bgColor="#fee2e2"
            className="transform transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex justify-center mb-2">
              <FaTimesCircle className="text-red-500 text-3xl" />
            </div>
            <h5 className="text-center text-black">Rejected</h5>
            <h1 className="text-center text-black text-2xl font-bold">
              {rejected}
            </h1>
          </BigCard>
        </div>

        {/* Jobs by Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BigCard>
            <div className="flex justify-between items-center mb-4">
              <h5>Recent Applications</h5>
              <a
                href="/applications"
                className="text-blue-500 no-underline hover:underline"
              >
                view all
              </a>
            </div>
            <div className="flex flex-col gap-4">
              {latestJobs.map((job) => (
                <DetailCard
                  key={job.id}
                  company={job.company}
                  role={job.title}
                  date={job.date}
                  status={job.status}
                />
              ))}
            </div>
          </BigCard>
          <BigCard color="white">
            <div className="flex justify-between items-center mb-4">
              <h5>Upcoming Events</h5>
              <a
                href="/calendar"
                className="text-blue-500 no-underline hover:underline"
              >
                view all
              </a>
            </div>

            <div className="flex flex-col gap-3">
              {latestEvents.map((ev) => (
                <EventCard
                  key={ev.id}
                  title={ev.title}
                  note={ev.note}
                  dayLeft={ev.startDate}
                />
              ))}
            </div>
          </BigCard>
        </div>
        <div className="bg-white border-0 rounded-md p-2 lg:max-w-[50%] max-w-full">
          <h3 className="mb-4 mt-1 mx-2 text-xl sm:text-2xl font-bold">
            Job Status
          </h3>
          <div className="grid place-items-center">
            <Doughnut data={chartData} options={options} />
          </div>
        </div>
      </div>
    </MainLayOut>
  );
}

export default Dashboard;
