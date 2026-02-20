import { Job } from "../models/job.model.js";
import { logger } from "../utils/logger.js";

export async function createJob(req, res) {
  const job = await Job.create({ ...req.body, createdBy: req.user.id });
  res.status(201).json(job);
}

export async function listJobs(_req, res) {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
}

// Aggregation pipeline to surface salary and volume insights per company
export async function getJobStats(_req, res) {
  const stats = await Job.aggregate([
    {
      $group: {
        _id: "$company",
        totalJobs: { $sum: 1 },
        avgSalary: { $avg: "$salary" },
        minSalary: { $min: "$salary" },
        maxSalary: { $max: "$salary" },
      },
    },
    { $sort: { totalJobs: -1 } },
  ]);

  res.json(stats.map(({ _id, ...rest }) => ({ company: _id, ...rest })));
}

export async function getJob(req, res) {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  res.json(job);
}

export async function updateJob(req, res) {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!job) return res.status(404).json({ message: "Job not found" });
  logger.info({ jobId: job.id }, "Job updated");
  res.json(job);
}

export async function deleteJob(req, res) {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });
  if (
    job.createdBy.toString() !== req.user.id &&
    !req.user.roles.includes("admin")
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }
  await job.deleteOne();
  res.status(204).send();
}
