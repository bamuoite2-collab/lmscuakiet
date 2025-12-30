# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up environment variables
# Copy the example file and fill in your Supabase credentials
cp .env.example .env
# Then edit .env with your actual values from https://app.supabase.com

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Setting Up Your Environment

### Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase credentials from [Supabase Dashboard](https://app.supabase.com):
   - Project Settings → API
   - Copy the Project URL and anon/public key
   - Update the values in `.env`

3. **Never commit `.env` to git** - it's already in `.gitignore`

### Setting Up First Admin

Since all new users are created as students by default, you need to manually create the first admin:

1. **Create a user account** through the signup page

2. **Connect to your Supabase database** (SQL Editor in dashboard)

3. **Run this SQL query** (replace with your admin email):
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin'::app_role
   FROM auth.users
   WHERE email = 'your-admin@example.com'
   ON CONFLICT (user_id, role) DO NOTHING;
   ```

4. **Verify admin role** was created:
   ```sql
   SELECT u.email, ur.role
   FROM auth.users u
   JOIN user_roles ur ON u.id = ur.user_id
   WHERE u.email = 'your-admin@example.com';
   ```

### Promoting Additional Admins

After logging in as an admin, you can promote other users through the database:

```sql
-- Promote a user to admin (only works if you're already an admin)
SELECT public.promote_to_admin('new-admin@example.com');
```

Or use the Supabase SQL Editor:

```sql
-- Manual promotion (requires direct database access)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'new-admin@example.com'
ON CONFLICT (user_id, role) DO NOTHING;
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
