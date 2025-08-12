CREATE TABLE job_postings (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT,
    location TEXT,
    employment_type TEXT CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'internship')),
    description TEXT NOT NULL, -- job description
    requirements TEXT,         -- bullet points or HTML/Markdown
    salary_range TEXT,          -- optional
    status TEXT NOT NULL CHECK (status IN ('open', 'closed')) DEFAULT 'open',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE job_applications (
    id UUID PRIMARY KEY,
    job_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    cover_letter TEXT,
    resume_url TEXT, -- store in S3/Firebase/etc.
    status TEXT CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected', 'hired')) DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT NOW()
);

Table order_address as OA {
  id serial [pk]
  first_name varchar(255) [not null]
  last_name varchar(255) [not null]
  phone_number varchar(255) [not null]
  email varchar(255) [not null]
  county varchar(255) [not null]
  country varchar(255) [not null]
  postal_code varchar(255) [not null]
}