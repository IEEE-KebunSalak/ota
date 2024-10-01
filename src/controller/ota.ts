import type { Request, Response } from "express";
import db from "../services/db";

export const getAllOtas = async (req: Request, res: Response) => {
  const ota = await db.oTA.findMany({
    select: {
      id: true,
      version: true,
      gatewayId: true,
      createdAt: true,
    },
    orderBy: {
      version: "desc",
    },
  });

  res.status(200).json(ota);
};

export const getOtaByGatewayId = async (req: Request, res: Response) => {
  const gatewayId = req.params.gatewayId;

  if (!gatewayId) {
    res.status(400).json({
      message: "Gateway ID is required",
    });
    return;
  }

  const id = parseInt(gatewayId, 10);

  const ota = await db.oTA.findMany({
    where: {
      gatewayId: id,
    },
    select: {
      id: true,
      version: true,
      gatewayId: true,
      createdAt: true,
    },
    orderBy: {
      version: "desc",
    },
  });

  res.status(200).json(ota);
};

export const getLatestOtaByGatewayId = async (req: Request, res: Response) => {
  const gatewayId = req.params.gatewayId;

  if (!gatewayId) {
    res.status(400).json({
      message: "Gateway ID is required",
    });
    return;
  }

  const id = parseInt(gatewayId, 10);

  const ota = await db.oTA.findFirst({
    where: {
      gatewayId: id,
    },
    select: {
      id: true,
      version: true,
      gatewayId: true,
      createdAt: true,
    },
    orderBy: {
      version: "desc",
    },
  });

  if (!ota) {
    res.status(404).json({
      message: "OTA not found",
    });
    return;
  }

  res.status(200).json(ota);
};

export const reportOta = async (req: Request, res: Response) => {
  const { version, gatewayId } = req.body;

  if (!version || !gatewayId) {
    res.status(400).json({
      message: "Version and Gateway ID are required",
    });

    return;
  }

  const id = Number(gatewayId);

  const report = await db.oTAHistory.findFirst({
    where: {
      gatewayId: id,
      version,
    },
  });

  if (!report) {
    await db.oTAHistory.create({
      data: {
        gatewayId: id,
        version,
      },
    });
  }

  res.status(200).json({
    message: "OTA reported",
  });
};

export const serveOtaDownload = async (req: Request, res: Response) => {
  const { gatewayId, version } = req.params;

  if (!gatewayId || !version) {
    res.status(400).json({
      message: "Gateway ID and Version are required",
    });
    return;
  }

  const id = Number(gatewayId);
  const versionNumber = Number(version);

  const ota = await db.oTA.findFirst({
    where: {
      gatewayId: id,
      version: versionNumber,
    },
    select: {
      file: true,
    },
    orderBy: {
      version: "desc",
    },
  });

  if (!ota) {
    res.status(404).json({
      message: "OTA not found",
    });
    return;
  }

  res
    .status(200)
    // .type("application/octet-stream")
    // .setHeader("Content-Disposition", `attachment; filename=${version}.bin`)
    .send(ota.file);
};
