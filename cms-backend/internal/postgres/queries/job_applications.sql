-- name: CreateJobApplication :one
INSERT INTO job_applications (job_id, full_name, email, phone_number, cover_letter, resume_url, submitted_at)
VALUES (sqlc.arg('job_id'), sqlc.arg('full_name'), sqlc.arg('email'), sqlc.arg('phone_number'), sqlc.arg('cover_letter'), sqlc.arg('resume_url'), NOW())
RETURNING id;

-- name: CheckJobApplicationExists :one
SELECT EXISTS (
    SELECT 1 FROM job_applications
    WHERE job_id = $1 AND email = $2
);

-- name: GetJobApplication :one
SELECT 
    ja.*,
    COALESCE(jp.job_json, '{}') AS job
FROM job_applications ja
LEFT JOIN LATERAL (
    SELECT json_build_object(
        'id', j.id,
        'title', j.title,
        'department_id', j.department_id,
        'location', j.location,
        'employment_type', j.employment_type,
        'content', j.content,
        'start_date', j.start_date,
        'end_date', j.end_date
    ) AS job_json
    FROM job_postings j
    WHERE j.id = ja.job_id
) jp ON true
WHERE ja.id = $1;

-- name: GetJobApplicationsByJobID :many
SELECT * FROM job_applications
WHERE job_id = $1
ORDER BY submitted_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: UpdateJobApplication :one
UPDATE job_applications
SET status = COALESCE(sqlc.narg('status'), status),
    comment = COALESCE(sqlc.narg('comment'), comment),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: ListJobApplications :many
SELECT * FROM job_applications
WHERE 
    (
        COALESCE(sqlc.narg('search')::text, '') = ''
        OR LOWER(full_name) LIKE sqlc.narg('search')
        OR LOWER(email) LIKE sqlc.narg('search')
        OR LOWER(phone_number) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('status')::text IS NULL
        OR status = sqlc.narg('status')
    )
    AND (
        COALESCE(sqlc.narg('job_id')::bigint, 0) = 0
        OR job_id = sqlc.narg('job_id')
    )
ORDER BY submitted_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountJobApplications :one
SELECT COUNT(*) FROM job_applications
WHERE 
    (
        COALESCE(sqlc.narg('search')::text, '') = ''
        OR LOWER(full_name) LIKE sqlc.narg('search')
        OR LOWER(email) LIKE sqlc.narg('search')
        OR LOWER(phone_number) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('status')::text IS NULL
        OR status = sqlc.narg('status')
    )
    AND (
        COALESCE(sqlc.narg('job_id')::bigint, 0) = 0
        OR job_id = sqlc.narg('job_id')
    );