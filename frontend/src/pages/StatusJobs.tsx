import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import MainLayOut from "../layouts/MainLayOut";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";
import ConfirmDialog from "../components/ConfirmDialog";
import { FaArrowsAlt } from "react-icons/fa";

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

type JobColumns = Record<Job["status"], Job[]>;

const fetchJobs = async () => {
  const response = await axiosInstance(API_PATH.JOBS.GETJOBS);
  return response.data.jobs;
};

const JobBoard: React.FC = () => {
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] =
    useState<() => void | null>(null);

  const {
    data: allJobs = [],
    isLoading,
    error,
  } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });

  const [jobs, setJobs] = useState<JobColumns>({
    noresponse: [],
    applied: [],
    interview: [],
    rejected: [],
    offer: [],
  });
  const updateJobMutation = useMutation({
    mutationFn: (job: Job) =>
      axiosInstance.put(API_PATH.JOBS.UPDATEJOBS(job.id), job),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });
  // sync data from query to local state
  useEffect(() => {
    const grouped: JobColumns = {
      noresponse: allJobs.filter((j) => j.status === "noresponse"),
      applied: allJobs.filter((j) => j.status === "applied"),
      interview: allJobs.filter((j) => j.status === "interview"),
      rejected: allJobs.filter((j) => j.status === "rejected"),
      offer: allJobs.filter((j) => j.status === "offer"),
    };
    setJobs(grouped);
  }, [allJobs]);
  // ฟังก์ชันตอนลากเสร็จ
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceId = source.droppableId as keyof JobColumns;
    const destId = destination.droppableId as keyof JobColumns;

    if (sourceId === destId) {
      // reorder in same column
      const column = Array.from(jobs[sourceId]);
      const [moved] = column.splice(source.index, 1);
      column.splice(destination.index, 0, moved);

      setJobs({
        ...jobs,
        [sourceId]: column,
      });
    } else {
      // move to another column
      const sourceColumn = Array.from(jobs[sourceId]);
      const destColumn = Array.from(jobs[destId]);
      const [moved] = sourceColumn.splice(source.index, 1);
      destColumn.splice(destination.index, 0, moved);
      setOnConfirmCallback?.(() => () => {
        setJobs({
          ...jobs,
          [sourceId]: sourceColumn,
          [destId]: destColumn,
        });
        const movedJob = destColumn[destination.index]; // job ที่เพิ่งถูกย้าย
        const updatedJob = { ...movedJob, status: destId }; // เปลี่ยน status ตาม column ปลายทาง

        updateJobMutation.mutate(updatedJob);
        setShowConfirm(false);
      });
      setShowConfirm(true);
    }
  };
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;
  const columnColors: Record<string, string> = {
    noresponse: "bg-gray-300 text-gray-800",
    applied: "bg-blue-200 text-blue-800",
    interview: "bg-yellow-200 text-yellow-800",
    offer: "bg-green-200 text-green-800",
    rejected: "bg-red-200 text-red-800",
  };

  return (
    <MainLayOut>
      <div className="mb-6 p-5 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl shadow-md flex flex-col md:flex-row md:items-center gap-3">
        {/* Icon */}
        <FaArrowsAlt className="text-indigo-600 text-3xl md:text-4xl" />

        {/* Text */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-900 mb-1">
            Job Status Board
          </h1>
          <p className="text-md md:text-lg text-indigo-700">
            You can drag and drop the cards to update the status of your jobs.
          </p>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex w-full h-screen overflow-x-auto p-4 gap-4 ">
          {Object.entries(jobs).map(([status, items]) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  className="w-72 flex-shrink-0 bg-white rounded-xl p-3 shadow-inner "
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {/* Column Header */}
                  <h2
                    className={`text-lg font-semibold mb-4 p-2 rounded text-center ${columnColors[status]}`}
                  >
                    {status}
                  </h2>

                  {/* Job Cards */}
                  {items.map((job, index) => (
                    <Draggable
                      key={job.id}
                      draggableId={job.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white rounded-lg p-4 mb-3 shadow hover:shadow-lg transform hover:-translate-y-1 transition-all border border-gray-200"
                        >
                          <p className="font-semibold text-gray-800">
                            {job.company}
                          </p>
                          <p className="text-sm text-gray-600">{job.title}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <ConfirmDialog
        visible={showConfirm}
        message="Are you sure that you want to update status of job?"
        onConfirm={() => onConfirmCallback && onConfirmCallback()}
        onCancel={() => setShowConfirm(false)}
      />
    </MainLayOut>
  );
};

export default JobBoard;
