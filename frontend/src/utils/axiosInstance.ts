import axios from "axios";
import { BASE_URL } from "./apiPath";

/* Interceptors = ฟังก์ชันพิเศษใน Axios ที่ทำงาน ก่อน หรือ หลัง การส่ง request / response ออกไป

Request interceptor → แทรกหรือแก้ไขข้อมูลก่อน request ถูกส่งออกไป

Response interceptor → ดัก response หรือ error ก่อนจะถึงโค้ดหลักของคุณ*/
//ประโยชน์ คือ ถ้ามีหลายendpoint โค้ดจะจัดการง่ายมากขึ้น ไม่ต้องเขียนซ้ำซ่าก
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json", //บอกว่า body ที่ส่งเป็น JSON
    Accept: "application/json", //บอกว่าเราคาดว่าจะได้ response เป็น JSON
  },
});

axiosInstance.interceptors.request.use(
  //ส่วนนี้จะทำงานก่อนส่งrequest ออกไป
  (config) => {
    const accessToken = localStorage.getItem("token"); //ดึง token จาก localstorage ถ้าเคยล็อคอินจะมีtokenเก็บไว้อยู่่
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } //ถ้ามี token จะกลายเป็น Authorization: Bearer eyJhbGciOi...

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    //ถ้าไม่มี error ก็ส่ง res กลับไปตามปกติ
    return response;
  }, //ทำงานก่อนส่ง res,error กลับไปที่ โค้ดหลัก
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error("Server error. Please try again");
      }
    } else if (error.code === "ECONNABORTED") {
      //ถ้า req ใช้เวลานานเกิน 10วิ
      console.error("Request timeout.please try again");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
