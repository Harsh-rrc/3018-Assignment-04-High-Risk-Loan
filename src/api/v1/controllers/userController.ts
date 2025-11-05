import { Request, Response } from 'express';
import admin from 'firebase-admin';

// Controller to set custom user claims (roles)
export const setCustomUserClaims = async (req: Request, res: Response) => {
  try {
    const { uid, role } = req.body;
    if (!uid || !role) return res.status(400).json({ error: 'UID and role are required.' });

    await admin.auth().setCustomUserClaims(uid, { role });
    res.status(200).json({ message: `Role '${role}' assigned to user ${uid}` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCustomUserClaims = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const user = await admin.auth().getUser(uid);
    res.status(200).json({ uid, claims: user.customClaims || {} });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};