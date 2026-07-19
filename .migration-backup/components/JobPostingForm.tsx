import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Define the shape of jobData
interface JobData {
  title: string
  company: string
  location: string
  description: string
  requirements: string
  salary: string
}

// Define the props for the component, specifying the type of onSubmit
interface JobPostingFormProps {
  onSubmit: (data: JobData) => void
}

export function JobPostingForm({ onSubmit }: JobPostingFormProps) {
  const [jobData, setJobData] = useState<JobData>({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setJobData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(jobData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          name="title"
          value={jobData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          name="company"
          value={jobData.company}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={jobData.location}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          name="description"
          value={jobData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          name="requirements"
          value={jobData.requirements}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="salary">Salary</Label>
        <Input
          id="salary"
          name="salary"
          value={jobData.salary}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit">Proceed to Payment</Button>
    </form>
  )
}
