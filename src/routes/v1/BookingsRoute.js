/* eslint-disable quotes */
import express from "express"
import { bookingController } from "~/controllers/bookingController"

const router = express.Router()

// Danh sách route đặt sân
router.get("/", bookingController.getAll)
router.get("/:id", bookingController.getById)
router.post("/", bookingController.createNew)
router.put("/:id", bookingController.update)

// ✅ Route HỦY ĐẶT SÂN
router.put("/:id/cancel", bookingController.cancelBooking)
// Admin hủy (từ dashboard)
router.put('/:id/admin-cancel', bookingController.adminCancelBooking)
router.delete("/:id", bookingController.remove)

export const bookingRoute = router
