import { Router } from "express";
import {
  getAllOtas,
  getLatestOtaByGatewayId,
  reportOta,
  getOtaByGatewayId,
  serveOtaDownload,
} from "../controller/ota";

const router = Router({ mergeParams: true });

router.get("/", getAllOtas);
router.post("/report", reportOta);
router.get("/latest/:gatewayId", getLatestOtaByGatewayId);

router.get("/:gatewayId", getOtaByGatewayId);
router.get("/firmware/:gatewayId/:version/firmware.bin", serveOtaDownload);

export default router;
