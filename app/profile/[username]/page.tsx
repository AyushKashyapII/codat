'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { Profile } from '@prisma/client'
import { useModel } from '@/hooks/user-model-store'

export default function ProfilePage() {
  const { profile, setProfile } = useModel();
  const { username } = useParams() as { username: string }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!username) return

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await axios.get(`/api/profile/${username}`)
        setProfile(res.data)
      } catch (error) {
        setError('Failed to load profile')
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username, setProfile])

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>
  if (!profile) return <div className="text-center py-10">Profile not found.</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        {profile.image && (
          <img src={profile.image} alt={profile.name} className="w-20 h-20 rounded-full" />
        )}
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-gray-500">{profile.email}</p>
        </div>
      </div>

      {/* Teams Section */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Teams</h2>
        <div className="mt-2 space-y-2">
          <p><strong>Owner:</strong> {profile.teamsOwnerOf?.length > 0 ? profile.teamsOwnerOf.map(t => t.teamName).join(', ') : 'None'}</p>
          <p><strong>Moderator:</strong> {profile.teamsModeratorOf?.length > 0 ? profile.teamsModeratorOf.map(t => t.teamName).join(', ') : 'None'}</p>
          <p><strong>Member of:</strong> {profile.teamsPartsOf?.length > 0 ? profile.teamsPartsOf.map(t => t.teamName).join(', ') : 'None'}</p>
        </div>
      </section>

      {/* Codats Section */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Codats</h2>
        <div className="mt-2 space-y-2">
          <p><strong>Authored:</strong> {profile.codatsAuthored?.length > 0 ? profile.codatsAuthored.map(c => c.codatName).join(', ') : 'None'}</p>
          <p><strong>Saved:</strong> {profile.codatsSaved?.length > 0 ? profile.codatsSaved.map(c => c.codatName).join(', ') : 'None'}</p>
        </div>
      </section>

      {/* Followed Users */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Following</h2>
        <ul className="mt-2 space-y-2">
          {profile.usersFollowed?.length > 0 ? (
            profile.usersFollowed.map(({ following }) => (
              <li key={following.id} className="border-b py-2">{following.name}</li>
            ))
          ) : (
            <p>No users followed.</p>
          )}
        </ul>
      </section>
    </div>
  )
}
