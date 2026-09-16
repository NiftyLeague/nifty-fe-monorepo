import JobCard from '@/components/Careers/JobCard'
import { JOBS } from '@/constants/careers'

export default function CareersJobs() {
  return (
    <>
      {JOBS.map((details) => (
        <JobCard details={details} />
      ))}
    </>
  )
}
