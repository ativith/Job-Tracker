export const BASE_URL="http://localhost:8000"

export const API_PATH = {
    USER:{
        GETUSERPROFILE:"/api/user/getuserprofile",
        UPDATEPROFILE:() => "/api/user/updateprofile"
    },
    AUTH:{
        LOGIN:"/api/auth/login",
        REGISTER:"/api/auth/register",
    },
    JOBS:{
        GETJOBS:"api/jobs/getjobs",
        ADDNEWJOBS:"/api/jobs/addnewjobs",
        UPDATEJOBS: (id: number) => `api/jobs/updatejobs/${id}`,
        DELETEJOBS: (id:number) => `/api/jobs/deletejobs/${id}`
    },
    EVENTS:{
        GETEVENTS:"/api/events/getevents",
        ADDEVENTS:"/api/events/addevents",
        UPDATEEVENTS:(id: number) => `api/events/updateevents/${id}`,
        DELETEEVENTS: (id:number) => `/api/events/deleteevents/${id}`
    }
}