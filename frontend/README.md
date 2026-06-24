# Frontend (React + Tailwind)

This frontend was copied from your `my-basecamp-1` project and adapted to work with this backend API.

## Scripts

From project root:

```bash
npm --prefix frontend run dev      # start local dev server
npm --prefix frontend run build    # production build
npm --prefix frontend run preview  # preview build
```

Or inside `frontend/`:

```bash
npm run dev
npm run build
npm run preview
```

## API base URL

By default the app uses:

- `http://localhost:8080/api`

Override with `.env` inside `frontend/`:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

## Notes

- Backend session authentication is cookie-based.
- Frontend requests are sent with `withCredentials: true`.
