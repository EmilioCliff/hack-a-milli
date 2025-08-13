-- name: CreateJobPosting :one
INSERT INTO job_postings (title, department_id, location, employment_type, content, salary_range, start_date, end_date)
VALUES (sqlc.arg('title'), sqlc.arg('department_id'), sqlc.arg('location'), sqlc.arg('employment_type'), sqlc.arg('content'), sqlc.narg('salary_range'), sqlc.arg('start_date'), sqlc.arg('end_date'))
RETURNING id;

-- name: GetJobPosting :one
SELECT 
    jp.*,
    d.name
FROM job_postings jp
JOIN departments d ON jp.department_id = d.id
WHERE jp.id = $1;

-- name: UpdateJobPosting :one
UPDATE job_postings
SET title = COALESCE(sqlc.arg('title'), title),
    department_id = COALESCE(sqlc.arg('department_id'), department_id),
    location = COALESCE(sqlc.arg('location'), location),
    employment_type = COALESCE(sqlc.arg('employment_type'), employment_type),
    content = COALESCE(sqlc.arg('content'), content),
    salary_range = COALESCE(sqlc.narg('salary_range'), salary_range),
    start_date = COALESCE(sqlc.arg('start_date'), start_date),
    end_date = COALESCE(sqlc.arg('end_date'), end_date),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: DeleteJobPosting :exec
UPDATE job_postings
SET deleted_at = NOW(),
    deleted_by = sqlc.arg('deleted_by')
WHERE id = sqlc.arg('id');

-- name: PublishJobPosting :one
UPDATE job_postings
SET published = TRUE,
    published_at = NOW(),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: ChangeVisibilityJobPosting :one
UPDATE job_postings
SET show_case = sqlc.arg('show_case'),
    updated_by = sqlc.arg('updated_by'),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
RETURNING *;

-- name: ListJobPostings :many
SELECT 
    jp.*,
    d.name AS department_name
FROM job_postings jp
JOIN departments d ON jp.department_id = d.id
WHERE 
    jp.deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(jp.title) LIKE sqlc.narg('search')
        OR LOWER(d.name) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR jp.published = sqlc.narg('published')
    )
    AND (
        sqlc.narg('employment_type')::text IS NULL 
        OR jp.employment_type = sqlc.narg('employment_type')
    )
    AND (
        sqlc.narg('show_case')::boolean IS NULL 
        OR jp.show_case = sqlc.narg('show_case')
    )
ORDER BY jp.created_at DESC
LIMIT sqlc.arg('limit') OFFSET sqlc.arg('offset');

-- name: CountJobPostings :one
SELECT COUNT(*) FROM job_postings
WHERE 
    deleted_at IS NULL
    AND (
        COALESCE(sqlc.narg('search'), '') = '' 
        OR LOWER(title) LIKE sqlc.narg('search')
        OR LOWER(d.name) LIKE sqlc.narg('search')
    )
    AND (
        sqlc.narg('published')::boolean IS NULL 
        OR published = sqlc.narg('published')
    )
    AND (
        sqlc.narg('employment_type')::text IS NULL 
        OR employment_type = sqlc.narg('employment_type')
    )
    AND (
        sqlc.narg('show_case')::boolean IS NULL 
        OR show_case = sqlc.narg('show_case')
    );