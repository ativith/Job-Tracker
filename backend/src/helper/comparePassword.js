const bcrypt = require("bcrypt");

exports.hashPassword = async (plainPassword) => {
  const saltRounds = 10; // ค่า default ปลอดภัย
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

/* เมื่อผู้ใช้กรอกรหัสผ่านเพื่อ login:

bcrypt จะ ดึง salt จาก hash ที่เก็บในฐานข้อมูล

นำ salt มาผสมกับรหัสผ่านที่ผู้ใช้กรอก → hash ใหม่

แล้วเปรียบเทียบ hash ใหม่ กับ hash ใน database  (hash คือ รหัสที่ผ่านการhash)*/
exports.comparePassword = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch; // true ถ้า password ถูกต้อง, false ถ้าไม่ถูก
};
