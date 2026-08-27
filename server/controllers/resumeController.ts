import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { ResumeRepository } from '../models/Resume.js';

// @desc    Get all resumes for the authenticated user
// @route   GET /api/resumes
// @access  Private (JWT)
export const getResumes = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const resumes = await ResumeRepository.findByUserId(userId);
    return res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error: any) {
    console.error('[Resume Controller] getResumes error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch resumes from database.',
      error: error.message,
    });
  }
};

// @desc    Get a single resume by ID for the authenticated user
// @route   GET /api/resumes/:id
// @access  Private (JWT)
export const getResumeById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const resume = await ResumeRepository.findByIdAndUser(id, userId);
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or you do not have permission to view this document.',
      });
    }

    return res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error: any) {
    console.error('[Resume Controller] getResumeById error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch resume details.',
      error: error.message,
    });
  }
};

// @desc    Create a new resume for the authenticated user
// @route   POST /api/resumes
// @access  Private (JWT)
export const createResume = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const resumeData = req.body || {};
    const created = await ResumeRepository.create(userId, resumeData);

    return res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: created,
    });
  } catch (error: any) {
    console.error('[Resume Controller] createResume error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create new resume.',
      error: error.message,
    });
  }
};

// @desc    Update an existing resume
// @route   PUT /api/resumes/:id
// @access  Private (JWT)
export const updateResume = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const updated = await ResumeRepository.update(id, userId, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or you do not have permission to edit this document.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('[Resume Controller] updateResume error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update resume.',
      error: error.message,
    });
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private (JWT)
export const deleteResume = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const deleted = await ResumeRepository.delete(id, userId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found or you do not have permission to delete this document.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Resume deleted successfully.',
    });
  } catch (error: any) {
    console.error('[Resume Controller] deleteResume error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete resume.',
      error: error.message,
    });
  }
};
