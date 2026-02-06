# Leo Duong E-Commerce Website

A full-stack e-commerce web application built with Next.js, featuring user authentication, product management, a seller dashboard, shopping cart, wishlist, Stripe checkout, and order tracking

## Live Demo
https://e-commerce-website-ecru-rho.vercel.app/

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Demo Mode](#demo-mode)
- [License](#license)

## Features

- **Authentication** - User sign-up/sign-in powered by Clerk
- **Product Catalog** - Browse, search, filter, and sort products by category, price, and name
- **Shopping Cart** - Add/remove items, update quantities, persistent cart for logged-in users
- **Wishlist** - Save products for later
- **Checkout** - Stripe-powered payment with Cash on Delivery option
- **Promo Codes** - Apply discount codes at checkout
- **Order Tracking** - View order history and status updates
- **Seller Dashboard** - Add, edit, delete products and manage orders
- **Demo Mode** - Read-only seller dashboard access for visitors (search `seller@demo.com`)
- **Responsive Design** - Mobile-first layout with Tailwind CSS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | JavaScript (React 19) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + CSS Modules |
| Authentication | [Clerk](https://clerk.com/) |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) + Mongoose |
| Payments | [Stripe](https://stripe.com/) |
| Image Hosting | [Cloudinary](https://cloudinary.com/) |
| Background Jobs | [Inngest](https://www.inngest.com/) |
| Deployment | [Vercel](https://vercel.com/) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.17 or later
- A [MongoDB Atlas](https://cloud.mongodb.com/) cluster
- A [Clerk](https://dashboard.clerk.com/) application
- A [Cloudinary](https://console.cloudinary.com/) account
- A [Stripe](https://dashboard.stripe.com/) account
- An [Inngest](https://app.inngest.com/) account (optional, for background jobs)

### Installation

```bash
git clone https://github.com/LeoDuong28/E_Commerce_Website.git
cd E_Commerce_Website
npm install
```

### Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

See [.env.example](.env.example) for all required variables and descriptions.

**Key variables to set:**

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `STRIPE_API_KEY` | Stripe publishable key |
| `STRIPE_API_SECRET` | Stripe secret key |
| `NEXT_PUBLIC_SITE_URL` | Your deployed URL (or `http://localhost:3000` for local dev) |

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Setting Up a Seller Account

To grant seller access to a user, set the `ADMIN_EMAIL` in your `.env` file and run:

```bash
node scripts/setAdmin.js
```

## Deployment

This project is configured for Vercel deployment:

1. Push the repository to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add all environment variables from `.env.example` to the Vercel project settings
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel domain (e.g., `https://your-app.vercel.app`)
5. Deploy

## Project Structure

```
app/
  api/              # API routes (cart, order, product, user, wishlist, promo)
  seller/           # Seller dashboard pages (add product, product list, orders)
  all-products/     # Product catalog with search and filters
  product/[id]/     # Product detail page
  cart/             # Shopping cart
  checkout/         # Checkout with Stripe
  my-orders/        # Order history
  wishlist/         # Saved products
  about/            # About page
  contact/          # Contact page
  faq/              # FAQ page
  privacy/          # Privacy policy
assets/             # Static images and icons
components/         # Reusable React components
  Navbar/           # Site navigation
  Header/           # Homepage hero slider
  Banner/           # Promotional banner
  Footer/           # Site footer
  FeaturedProducts/ # Featured products section
  Subscribe/        # Newsletter subscription
  seller/           # Seller dashboard components (Navbar, Sidebar)
config/             # Database and Inngest configuration
context/            # React Context (global state)
lib/                # Utility functions (auth helpers)
models/             # Mongoose models (User, Product, Order, PromoCode)
scripts/            # CLI scripts (setAdmin)
```

## Demo Mode

Visitors can preview the seller dashboard without an account:

1. Type `seller@demo.com` in the search bar and press Enter
2. You will be redirected to the seller dashboard in read-only mode
3. Products are visible but adding, editing, and deleting are disabled
4. Click **Exit Demo** in the top-right to return to the store

## License

This project is for educational and portfolio purposes.
