
# 🥗 Dhruv Restaurants - Digital Menu & AI Invoice Generator

A world-class, premium digital menu application built for modern food businesses. This app allows restaurant owners to manage their menu, generate professional invoices, and share them instantly via WhatsApp/SMS, all backed by **Supabase** and enhanced by **Google Gemini AI**.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- **🚀 Cloud Sync**: Powered by Supabase Auth and Database. Your menu and sales history are available on any device.
- **🎨 Custom Branding**: Fully customizable theme colors and Google Fonts support.
- **🪄 AI Menu Enhancer**: Uses Gemini 3 Flash to rewrite dish descriptions into mouth-watering, Michelin-star copy.
- **🧾 Instant Invoicing**: Generate professional receipts with custom headers/footers and share directly to customers' WhatsApp.
- **📊 Admin Dashboard**: Track revenue, manage inventory, and view sales logs in a sleek, intuitive interface.
- **📱 Responsive Design**: Optimized for both kitchen tablets and customer smartphones.

## 🛠️ Tech Stack

- **Frontend**: React (v19) with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth, PostgreSQL)
- **AI Engine**: Google Generative AI (Gemini API)
- **Icons**: Font Awesome 6

## 🚀 Getting Started

### Prerequisites
- A Supabase Project
- A Google Gemini API Key

### Supabase Database Setup
Run the following SQL in your Supabase SQL Editor to initialize the tables:

```sql
-- Profiles Table
create table public.profiles (
  id uuid references auth.users not null primary key,
  name text,
  address text,
  contact text,
  logo text,
  owner_name text,
  receipt_header text,
  receipt_footer text,
  theme_color text default 'indigo',
  font_pair text default 'modern',
  custom_font_family text
);

-- Menu Items Table
create table public.menu_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  price numeric not null,
  half_price numeric,
  category text,
  image text
);

-- Orders Table
create table public.orders (
  id text primary key,
  user_id uuid references auth.users not null,
  customer_name text,
  customer_contact text,
  total numeric,
  timestamp text,
  items_summary text,
  payment_method text,
  cart_items_json jsonb
);

-- Security: Enable RLS and add policies for auth.uid() = user_id
```

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Created with ❤️ by Dhruv
