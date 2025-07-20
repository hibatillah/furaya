# Hotel Management System

Furaya Hotel Management System, focus on Front Desk module which is reservation system and room management.

## Features

- User Management
  - Manager
  - Admin
  - Employee
  - Guest
- Room Management
  - Room Status
  - Room Facilities
  - Room Type
  - Bed Type
  - Room Images
- Reservation Management
  - Booking
  - Check-in
  - Check-out
- Guest Page
  - Reservation
  - Reservation History
  - Payment
- Dashboard

## Technologies

- Laravel 12
- React 19
- Tailwind CSS 4
- Inertia.js
- TypeScript
- Shadcn UI
- Midtrans
- Recharts

## Installation

Install dependencies

```bash
composer install
npm install
```

## Database migration

Migrate database schema

```bash
php artisan migrate
```

Seed the database (optional)

```bash
php artisan db:seed
```

## Development

Run the development server

```bash
composer run dev
```

Run client and server separately (recommended)

```bash
php artisan serve
npm run dev
```

## Testing

Run tests for main features

```bash
php artisan test --filter=Main
```

[© hibatillah](https://github.com/hibatillah)
