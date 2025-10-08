/* eslint-disable no-console */
/* eslint-disable quotes */
/* eslint-disable no-multi-spaces */
/* eslint-disable indent */
import Joi from "joi"
import { ObjectId } from "mongodb"
import { GET_DB } from "~/config/mongodb"

export const BOOKING_COLLECTION_NAME = "bookings"

// 🧩 Schema chi tiết cho Booking
export const BOOKING_COLLECTION_SCHEMA = Joi.object({
  fieldId: Joi.string().required(),

  // Cho phép null hoặc không có customerId (khách vãng lai)
  customerId: Joi.alternatives().try(Joi.string(), Joi.allow(null, "")),

  customerName: Joi.string().allow("", null),
  customerPhone: Joi.string()
    .pattern(/^(0|\+84)\d{9,10}$/)
    .message("Số điện thoại không hợp lệ")
    .allow("", null),
  customerEmail: Joi.string().email().allow("", null),

  bookingDate: Joi.date().required(),
  startTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),
  endTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required(),

  totalPrice: Joi.number().min(0).required(),
  depositAmount: Joi.number().min(0).default(0),
  isDeposited: Joi.boolean().default(false),

  notes: Joi.string().max(500).allow("", null),

  // Các trạng thái hợp lệ
  status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "cancelled_refunded",
      "cancelled_no_refund",
      "cancelled_admin",
      "completed"
    )
    .default("pending"),

  refundAmount: Joi.number().min(0).default(0),

  // Ai là người hủy (nếu có)
  cancelledBy: Joi.string().valid("user", "admin").allow(null, ""),

  createdAt: Joi.date().timestamp().default(Date.now),
  updatedAt: Joi.date().timestamp().default(Date.now)
})

// ✅ Validate trước khi tạo mới
const validateBeforeCreate = async (data) => {
  return await BOOKING_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// ✅ Tạo mới booking
const createNew = async (data) => {
  // 🧹 Ép hoặc lọc dữ liệu sai kiểu trước khi validate
  if (data.isDeposited === "true" || data.isDeposited === "false") {
    data.isDeposited = data.isDeposited === "true"
  }
  if (typeof data.isDeposited !== "boolean") {
    delete data.isDeposited // để Joi tự default(false)
  }

  // Tương tự: đảm bảo totalPrice là số
  if (typeof data.totalPrice === "string") {
    data.totalPrice = Number(data.totalPrice)
  }

  // Đảm bảo bookingDate là Date object hợp lệ
  if (data.bookingDate && !(data.bookingDate instanceof Date)) {
    data.bookingDate = new Date(data.bookingDate)
  }

  const validData = await validateBeforeCreate(data)
  const result = await GET_DB()
    .collection(BOOKING_COLLECTION_NAME)
    .insertOne(validData)

  return result
}

// ✅ Tìm booking theo ID
const findOneById = async (id) => {
  if (!ObjectId.isValid(id)) return null
  return await GET_DB()
    .collection(BOOKING_COLLECTION_NAME)
    .findOne({ _id: new ObjectId(id) })
}

// ✅ Lấy tất cả bookings
const getAll = async () => {
  return await GET_DB()
    .collection(BOOKING_COLLECTION_NAME)
    .find()
    .sort({ createdAt: -1 }) // Mới nhất lên đầu
    .toArray()
}

// ✅ Cập nhật booking
// ✅ Cập nhật booking — an toàn cho mọi version MongoDB
const updateOne = async (id, data) => {
  try {
    if (!ObjectId.isValid(id)) {
      console.log("❌ ID không hợp lệ:", id)
      return null
    }

    const collection = GET_DB().collection(BOOKING_COLLECTION_NAME)

    // Ép kiểu trước khi update (tránh lỗi boolean/string)
    if (data.isDeposited === "true" || data.isDeposited === "false") {
      data.isDeposited = data.isDeposited === "true"
    }
    if (typeof data.isDeposited !== "boolean") {
      delete data.isDeposited
    }

    const updateData = {
      ...data,
      updatedAt: Date.now()
    }

    // ⚙️ Mongo version nào cũng hỗ trợ cách này
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    // ✅ Nếu modifiedCount > 0 → cập nhật thành công
    if (result.modifiedCount > 0) {
      const updatedDoc = await collection.findOne({ _id: new ObjectId(id) })
      console.log("✅ Booking update thành công:", updatedDoc._id)
      return updatedDoc
    }

    console.log("⚠️ Booking không tìm thấy khi update:", id)
    return null
  } catch (error) {
    console.error("❌ Lỗi trong updateOne:", error)
    throw error
  }
}



// ✅ Xóa booking
const deleteOne = async (id) => {
  if (!ObjectId.isValid(id)) return null
  return await GET_DB()
    .collection(BOOKING_COLLECTION_NAME)
    .deleteOne({ _id: new ObjectId(id) })
}

// ✅ Kiểm tra trùng giờ
const findOverlap = async (fieldId, bookingDate, startTime, endTime) => {
  return await GET_DB()
    .collection(BOOKING_COLLECTION_NAME)
    .findOne({
      fieldId,
      bookingDate: new Date(bookingDate),
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
      status: { $in: ["pending", "confirmed"] }
    })
}

export const bookingModel = {
  BOOKING_COLLECTION_NAME,
  BOOKING_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getAll,
  updateOne,
  deleteOne,
  findOverlap
}
