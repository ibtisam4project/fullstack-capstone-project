curl -X POST http://localhost:3060/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"registered_user@example.com","password":"password123"}'

{"authtoken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNmFiNzhmZWJmZjYwYjhmNDg5YThkNWUwIn0sImlhdCI6MTc5MDQxNDg4MH0.tKWauRGBbo9QUDaZC7IxyZmYiRVvMErS8RSrE-s3apI","userName":"Test","userEmail":"registered_user@example.com"}
