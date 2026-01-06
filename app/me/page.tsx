import { Header } from "@/components/Header";
import { requireAuth } from "@/lib/auth";
import { getCurrentUserProfile } from "@/lib/db/profiles";
import { updateProfile } from "@/app/actions/profile";
import { User, Save } from "lucide-react";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  await requireAuth();
  
  const profile = await getCurrentUserProfile();

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4">
          <div className="text-center">
            <p className="text-zinc-600">Profile not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                My Profile
              </h1>
              <p className="mt-2 text-zinc-600">
                Manage your profile information and preferences
              </p>
            </div>

            {/* Success/Error Messages */}
            {searchParams.success && (
              <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                <p className="text-sm text-green-800">
                  Profile updated successfully!
                </p>
              </div>
            )}

            {searchParams.error && (
              <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-800">{searchParams.error}</p>
              </div>
            )}

            {/* Profile Form */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
              <form action={updateProfile} className="p-6 space-y-6">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-medium text-zinc-900 mb-2"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    required
                    defaultValue={profile.full_name}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm"
                  />
                </div>

                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-zinc-900 mb-2"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    defaultValue={profile.username || ''}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm"
                    placeholder="Choose a username (optional)"
                  />
                  <p className="mt-1 text-xs text-zinc-500">
                    Your username will be visible to other users
                  </p>
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-900 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    disabled
                    className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-2 text-zinc-500 sm:text-sm cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-zinc-500">
                    Email cannot be changed. It's managed by your account settings.
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-zinc-900 mb-2"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    defaultValue={profile.bio || ''}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <p className="mt-1 text-xs text-zinc-500">
                    A short description about yourself (optional)
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-200">
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Profile Info Section */}
            <div className="mt-8 bg-zinc-50 rounded-lg border border-zinc-200 p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-zinc-900">
                    Profile Information
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    Member since {new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {profile.updated_at !== profile.created_at && (
                    <p className="mt-1 text-xs text-zinc-500">
                      Last updated {new Date(profile.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

