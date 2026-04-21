---
'@aspect/react': minor
'@aspect/css': minor
---

add DataCollection pattern — multi-view resource list coordinator with table / grid / list toggle, toolbar + search + pagination + loading + empty slots. Consumer-driven: DataCollection does NOT fetch, filter, sort, or paginate — caller owns state and passes the pre-processed slice.
